import type { StepsCreationState } from "@/hooks/store/StepsCreationStore.ts";
import type { User } from "@/hooks/store/types/store.types.ts";
import type { AttendanceRecordCreationFormSchema } from "@/models/attendance-record-creation.models.ts";
import type { StepTwo } from "@/pages/Evaluations/create/steps/two/StepTwo.tsx";
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
