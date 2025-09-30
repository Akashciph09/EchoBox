import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schema/signupSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    //new URL converts the url string in an object with different properties
    // http://localhost:3000/api/check-username-unique?username=akash
    //searchParams is a property of the URL object.

    //It gives you an easy way to work with query parameters (the part after ? in a URL).
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    //validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "Invalid query parameter",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: true,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error checking username", error);
    return Response.json(
      {
        success: false,
        message: "error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
