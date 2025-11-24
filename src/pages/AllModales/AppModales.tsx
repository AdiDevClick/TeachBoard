import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { LoginForm } from "@/components/LoginForms/LoginForm.tsx";
import { Modale, WithSimpleAlert } from "@/components/Modale/Modale.tsx";
import {
  inputLoginControllers,
  inputSignupControllers,
} from "@/data/inputs-controllers.data.ts";
import { useMutationObserver } from "@/hooks/useMutationObserver.ts";
import {
  defineStrictModalesList,
  isStandardModale,
  type AppModalesProps,
} from "@/pages/AllModales/types/modales.types.ts";
import { Signup } from "@/pages/Signup/Signup.tsx";

const modales = defineStrictModalesList([
  {
    modaleName: "login",
    type: Modale,
    modaleContent: LoginForm,
    contentProps: {
      inputControllers: inputLoginControllers,
      modaleMode: true,
    },
  },
  {
    modaleName: "signup",
    type: Modale,
    modaleContent: Signup,
    contentProps: {
      inputControllers: inputSignupControllers,
      modaleMode: true,
    },
  },
  {
    modaleName: "apple-login",
    type: Modale,
    modaleContent: LoginForm,
    contentProps: {
      inputControllers: inputLoginControllers,
      modaleMode: true,
    },
  },
  {
    modaleName: "pw-recovery-email-sent",
    type: WithSimpleAlert,
    modaleProps: {
      headerTitle: "Demande envoyée",
      headerDescription:
        "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
    },
  },
]) satisfies Parameters<typeof AppModales>[0]["modalesList"];

/**
 * AppModales component to render all modals used in the application.
 *
 * @param modalesList - List of modal configurations to render.
 *
 * @description The list have to be created with defineStrictModalesList to ensure proper typing.
 * {@link modales}
 */
export function AppModales({
  modalesList = modales,
}: Readonly<AppModalesProps>) {
  const { setRef, observedRef } = useMutationObserver({});

  return (
    <ListMapper items={modalesList}>
      {(modale) => {
        if (!modale.type) return null;

        const { modaleName } = modale;

        const commonProps = {
          onNodeReady: observedRef,
          modaleName: modaleName,
          key: modaleName,
        };

        if (isStandardModale(modale)) {
          const StandardModaleComponent = modale.type;
          const ContentComponent = modale.modaleContent;

          const renderedContent = (
            <ContentComponent ref={setRef} {...modale.contentProps} />
          );

          return (
            <StandardModaleComponent
              {...commonProps}
              modaleContent={renderedContent}
              {...(modale.modaleProps ?? {})}
            />
          );
        }

        const SimpleAlertComponent = modale.type;

        return (
          <SimpleAlertComponent
            {...commonProps}
            ref={setRef}
            {...modale.modaleProps}
          />
        );
      }}
    </ListMapper>
  );
}
