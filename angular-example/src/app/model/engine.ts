import {Quality} from "./quality";
import {Prediction} from "./prediction";

export interface Engine {
  qualities: Quality[];
  prediction: Prediction
}
