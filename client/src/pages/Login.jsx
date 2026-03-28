import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    password: "",
    identifier: "",
    showPassword: false,
  });
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (values.identifier && values.password) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [values.identifier, values.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: values.identifier,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      toast.success("Logged in successfully");
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      // Hard redirect resolves the NavBar rendering loop and clears route history correctly
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <section className="min-h-[100vh] flex items-center justify-center bg-base-100 px-4">
      <div className="container">
        <div className="flex justify-center items-center">
          <div className="card bg-base-100 shadow-xl p-10 w-full max-w-[500px] border border-base-200">
            <Link to="/" className="flex items-center justify-center mb-8 hover:opacity-75 transition-opacity group cursor-pointer" title="Return to Home">
               <svg
                  width={35}
                  height={29}
                  version="1.1"
                  viewBox="0 0 30 23"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <g
                    stroke="none"
                    strokeWidth="1"
                    fill="currentColor"
                    fillRule="evenodd"
                  >
                    <g
                      id="Artboard"
                      transform="translate(-95.000000, -51.000000)"
                    >
                      <g id="logo" transform="translate(95.000000, 50.000000)">
                        <path
                          id="Combined-Shape"
                          fill="currentColor"
                          d="M30,21.3918362 C30,21.7535219 29.9019196,22.1084381 29.7162004,22.4188007 C29.1490236,23.366632 27.9208668,23.6752135 26.9730355,23.1080366 L26.9730355,23.1080366 L23.714971,21.1584295 C23.1114106,20.7972624 22.7419355,20.1455972 22.7419355,19.4422291 L22.7419355,19.4422291 L22.741,12.7425689 L15,17.1774194 L7.258,12.7425689 L7.25806452,19.4422291 C7.25806452,20.1455972 6.88858935,20.7972624 6.28502902,21.1584295 L3.0269645,23.1080366 C2.07913318,23.6752135 0.850976404,23.366632 0.283799571,22.4188007 C0.0980803893,22.1084381 2.0190442e-15,21.7535219 0,21.3918362 L0,3.58469444 L0.00548573643,3.43543209 L0.00548573643,3.43543209 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 L15,9.19354839 L26.9548759,1.86636639 C27.2693965,1.67359571 27.6311047,1.5715689 28,1.5715689 C29.1045695,1.5715689 30,2.4669994 30,3.5715689 L30,3.5715689 Z"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              <h1 className="ml-3 text-2xl font-semibold uppercase group-hover:text-primary transition-colors">
                MailCraft
              </h1>
            </Link>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Welcome to MailCraft! 👋
              </h2>
              <p className="text-sm">
                Please sign-in to your account and start the adventure
              </p>
            </div>
            <form autoComplete="on" onSubmit={handleSubmit}>
              <input
                type="text"
                className="input input-bordered w-full mb-5"
                placeholder="Email / Username"
                value={values.identifier}
                onChange={(e) =>
                  setValues({ ...values, identifier: e.target.value })
                }
              />
              <div className="form-control w-full mb-5">
                <div className="relative">
                  <input
                    type={values.showPassword ? "text" : "password"}
                    className="input input-bordered w-full"
                    placeholder="Password"
                    value={values.password}
                    onChange={(e) => {
                      setValues({ ...values, password: e.target.value });
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => {
                      setValues({
                        ...values,
                        showPassword: !values.showPassword,
                      });
                    }}
                  >
                    {values.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full mb-7"
                disabled={disabled}
              >
                Login
              </button>
              <div className="flex justify-center items-center">
                <p className="text-sm mr-2">New on our platform?</p>
                <Link to="/signup" className="link link-primary">
                  Create an account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
