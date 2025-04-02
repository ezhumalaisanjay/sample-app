import { useState } from "react";
import LoginForm from "./login/signin";
import Signup from "./login/signup";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const isLoginTrue = () => {
    setIsLogin(true);
  }

  const isLoginFalse = () => {
    setIsLogin(false);
  }

  return (
    <>
      <div className="flex w-full justify-center">
        {isLogin ? 
        <LoginForm handleLogin={isLoginFalse}/>
        :
        <Signup handleLogin={isLoginTrue}/>
        }
      </div>
    </>
  );
}

export default App;
