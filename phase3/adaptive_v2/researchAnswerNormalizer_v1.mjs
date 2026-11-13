import {parseMeasuredAnswer} from "./typedQuestionnaireComparator_v1.mjs";
/** Normalizes validated questionnaire data without overwriting raw answers. */
export function buildResearchRuleAnswers(raw={}){
 const answers={...raw},issues=[];
 const caffeine=raw.lifestyle_caffeine_mg_estimate;
 if(caffeine!==undefined&&caffeine!==null&&caffeine!=="unknown"){
  const parsed=parseMeasuredAnswer(caffeine,"mg");
  if(!parsed.ok||parsed.unit!=="mg"||parsed.value<0||parsed.value>10000){
   issues.push("CAFFEINE_NUMERIC_INPUT_INVALID");
   delete answers.lifestyle_caffeine_daily;
  }else{
   answers.lifestyle_caffeine_daily=parsed.value;
  }
 }else if(["0","1","2_3","4plus"].includes(raw.lifestyle_caffeine_daily)){
  // Categorical intake never establishes exact mg/day, even zero drinks may omit supplements.
  delete answers.lifestyle_caffeine_daily;
  issues.push("CAFFEINE_MG_NOT_ESTABLISHED");
 }
 return {answers,issues,rawAnswersUnmodified:true};
}
