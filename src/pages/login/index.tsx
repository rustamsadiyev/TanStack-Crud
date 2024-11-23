import { useNavigate } from "@tanstack/react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Header from "../../components/header";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "../../components/ui/card";

const LoginSchema = z.object({
  username: z.string().min(1, "Username kiriting"),
  password: z.string().min(1, "Password kiriting"),
});

type FormFields = z.infer<typeof LoginSchema>;

export default function Login() {
  const [openLoginModal, setOpenLoginModal] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await axios.post("https://imb.4fun.uz/api/v1/auth/login/", data);

      if (response.status === 200) {
        localStorage.setItem("token", response.data.access);
        navigate({ to: "/" });
      }
    } catch (error) {
      toast.error("Login yoki parol noto'g'ri!");
      console.error("Login error:", error);
    }
  };

  return (
    <>
      {openLoginModal ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-semibold mb-4">Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    {...register("username")}
                    placeholder="Username"
                    type="text"
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username.message}</p>
                  )}

                  <Input
                    {...register("password")}
                    placeholder="Password"
                    type="password"
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )}
                  <div className="flex space-x-4">
                    <Button variant={"green"} type="submit" disabled={isSubmitting} className="w-[50%]">
                      Login
                    </Button>
                    <Button
                      className="w-[50%]"
                      onClick={() => setOpenLoginModal(false)}
                      variant={"destructive"}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Header/>
      )}
      <ToastContainer />
    </>
  );
}
