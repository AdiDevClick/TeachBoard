import type { User } from "@/api/store/types/app-store.types";
import type { AttendanceRecordCreationFormSchema } from "@/features/evaluations/create/steps/two/models/attendance-record-creation.models";
import type { StepTwo } from "@/features/evaluations/create/steps/two/StepTwo.tsx";
import type { StepsCreationState } from "@/features/evaluations/create/store/types/steps-creation-store.types.ts";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";

/**
 * Props for StepTwoController component
 */
export type StepTwoControllerProps =
  AppControllerInterface<AttendanceRecordCreationFormSchema> &
    Omit<Parameters<typeof StepTwo>[0], "modalMode"> & {
      user?: User;
      students?: StepsCreationState["students"];
      selectedClass?: StepsCreationState["selectedClass"];
    };
