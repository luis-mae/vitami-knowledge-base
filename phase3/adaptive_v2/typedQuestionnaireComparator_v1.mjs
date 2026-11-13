/**
 * Safe conversion of questionnaire values into typed rule inputs.
 * Ambiguous units and labels are never silently interpreted.
 */
const unknown=x=>x===undefined||x===null||x===""||["unknown","prefer_not","not_sure"].includes(x);
const numericPattern=/^\s*(-?\d+(?:[.,]\d+)?)\s*(mg|g|mcg|µg|ug)?\s*$/i;
const comparatorPattern=/^(>=|<=|>|<)\s*(-?\d+(?:[.,]\d+)?)\s*(mg|g|mcg|µg|ug)?$/i;
const normalizeUnit=u=>({ug:"mcg","µg":"mcg"}[u?.toLowerCase()]??u?.toLowerCase()??null);
const toMg=(n,u)=>u==="g"?n*1000:u==="mcg"?n/1000:u==="mg"?n:null;
export function parseMeasuredAnswer(value,declaredUnit=null){
 if(unknown(value))return {ok:false,reason:"UNKNOWN"};
 if(typeof value==="number"&&Number.isFinite(value))return {ok:true,value,unit:normalizeUnit(declaredUnit)};
 if(typeof value!=="string")return {ok:false,reason:"INVALID_TYPE"};
 const match=value.match(numericPattern);
 if(!match)return {ok:false,reason:"NON_NUMERIC_ANSWER"};
 const unit=normalizeUnit(match[2]??declaredUnit);
 return {ok:true,value:Number(match[1].replace(",",".")),unit};
}
export function compareMeasuredAnswer(actual,expression,{declaredUnit=null}={}){
 if(typeof expression!=="string")return {match:false,unknown:true,reason:"INVALID_COMPARATOR"};
 const m=expression.match(comparatorPattern);
 if(!m)return {match:false,unknown:true,reason:"UNSUPPORTED_COMPARATOR"};
 const actualParsed=parseMeasuredAnswer(actual,declaredUnit);
 if(!actualParsed.ok)return {match:false,unknown:true,reason:actualParsed.reason};
 const limit=Number(m[2].replace(",",".")),targetUnit=normalizeUnit(m[3]);
 let actualValue=actualParsed.value,limitValue=limit;
 if(targetUnit){
  if(!actualParsed.unit)return {match:false,unknown:true,reason:"UNIT_MISSING"};
  if(actualParsed.unit!==targetUnit){
   actualValue=toMg(actualParsed.value,actualParsed.unit);
   limitValue=toMg(limit,targetUnit);
   if(actualValue===null||limitValue===null)return {match:false,unknown:true,reason:"INCOMPATIBLE_UNITS"};
  }
 }else if(actualParsed.unit&&declaredUnit&&actualParsed.unit!==normalizeUnit(declaredUnit))return {match:false,unknown:true,reason:"UNEXPECTED_UNIT"};
 const operator=m[1];
 return {match:operator===">="?actualValue>=limitValue:operator==="<="?actualValue<=limitValue:operator===">"?actualValue>limitValue:actualValue<limitValue,unknown:false};
}
