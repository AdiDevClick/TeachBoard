import { LoginForm } from "@/components/LoginForms/LoginForm.tsx";
import { Modale } from "@/components/Modale/Modale.tsx";
import {
  inputLoginControllers,
  inputSignupControllers,
} from "@/data/inputs-controllers.data.ts";
import { useMutationObserver } from "@/hooks/useMutationObserver.ts";
import { Signup } from "@/pages/Signup/Signup.tsx";

/**
 * AppModales component to render all modals used in the application.
 */
export function AppModales() {
  const { setRef, observedRef } = useMutationObserver({});

  return (
    <>
      <Modale
        modaleName="login"
        modaleContent={
          <LoginForm
            ref={setRef}
            inputControllers={inputLoginControllers}
            modaleMode={true}
          />
        }
        onNodeReady={observedRef}
      />
      <Modale
        modaleName="signup"
        modaleContent={
          <Signup
            modaleMode={true}
            inputControllers={inputSignupControllers}
            ref={setRef}
          />
        }
        onNodeReady={observedRef}
      />
      <Modale
        modaleName="apple-login"
        modaleContent={
          <LoginForm
            inputControllers={inputLoginControllers}
            modaleMode={true}
            ref={setRef}
          />
        }
        onNodeReady={observedRef}
      />
    </>
  );
}
