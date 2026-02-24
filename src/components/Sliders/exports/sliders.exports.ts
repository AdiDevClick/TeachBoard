import withListMapper from "@/components/HOCs/withListMapper";
import { EvaluationSlider } from "@/components/Sliders/EvaluationSlider";
/**
 * @fileoverview This file exports the EvaluationSlider component and its list mapper.
 */

/**
 * A version of the EvaluationSlider component that can be used to render a list of sliders based on a list of items.
 */
export const EvaluationSliderList = withListMapper(EvaluationSlider);
