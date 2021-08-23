// 키가 만료되었는지 확인
// true -> 만료됨. 사용불가한 키
// false -> 아직 만료안됨. 사용가능한 키
export default function isExpired(expires: string, currentDay: Date): boolean {
  if (expires === '-') {
    return false;
  }
  return Date.parse(currentDay.toString()) < Date.parse(expires) ? false : true;
}
