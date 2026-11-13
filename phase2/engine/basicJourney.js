'use strict';
const {buildQuestionnaireStep}=require('./adaptiveQuestionnaire');
const {buildBasicResponse}=require('./vitamiEngine');
const {renderableBasicCards}=require('./basicPresentationAdapter');
/** Pure orchestration boundary for an eventual Emergent API route. */
function evaluateBasicJourney({selectedGoals=[],answers={},questionBank,goalBank,flow,rules=[],libraryRecords=[],doseRules=[],cardRecords=[],locale='es',sessionId=''}) {
  const navigation=buildQuestionnaireStep({selectedGoals,answers,questionBank,goalBank,flow,locale});
  if (!navigation.complete) return {status:'questions_required',navigation};
  const engine=buildBasicResponse({locale,sessionId,rawAnswers:answers,rules,libraryRecords,doseRules});
  if (engine.followup_questions.length) {
    const next=buildQuestionnaireStep({selectedGoals,answers,questionBank,goalBank,flow,locale,ruleFollowups:engine.followup_questions.map(q=>q.question_id)});
    if (!next.complete) return {status:'questions_required',navigation:next,professional_review:engine.professional_review};
  }
  const presentation=renderableBasicCards(engine,cardRecords);
  return {status:engine.overall_status,engine,presentation};
}
module.exports={evaluateBasicJourney};
