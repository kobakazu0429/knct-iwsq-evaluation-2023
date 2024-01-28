export const DEPARTMENT_MAP = {
  "1": "機械工学科",
  "2": "電気情報工学科",
  "3": "環境都市工学科",
  "4": "建築学科",
  "8": "専攻科",
  S: "専攻科",
  "0": "教職員",
};

export const EQUIPMENT_MAP = {
  "": "",
  Desk: "机",
  "Peopoly Phenom-L": "光造形",
  "ELEGOO Mars 2 Pro": "光造形",
  "ELEGOO Mercury Plus": "光造形(後処理)",
  "da Vinci Color": "FDM",
  "Creality CR-10 V2": "FDM",
  "Creality CR-10 V3": "FDM",
  "FABOOL Laser DS": "レーザー加工機",
  "FABOOL Laser CO2": "レーザー加工機",
  "smartDIYs LC950": "レーザー加工機",
  "Makita LT600": "パネルソー",
  "KitMill RZ300": "CNC",
  "KitMill SR200": "CNC",
  "KitMill CIP100": "CNC",
  RTX2060: "PC",
  "RYOBI CDD-1020": "ドリル・インパクト",
  "RYOBI CID-1100": "ドリル・インパクト",
  "SK11 SDP-600V": "ドリル・インパクト",
  "Makita DF484DRGX": "ドリル・インパクト",
  "Makita TD138DRFXL": "ドリル・インパクト",
  "Makita DF370DSH": "ドリル・インパクト",
  "Makita LS0717FL": "木工",
  "Makita 4327": "木工",
  "HiKOKI CB18FE": "木工",
  "Makita 9404": "木工",
  "Makita BO380DZ": "木工",
  "BOSCH PMR 500": "木工",
  "Makita 5710C": "木工",
  "Makita GA4033": "グライダー",
  "Makita 9539B": "グライダー",
  "Brother CM300": "その他",
  "PROMOTE PMR-165": "その他",
};

export const dateToSqliteDatetime = (date: Date) => {
  return date
    .toISOString()
    .replaceAll("T", " ")
    .replaceAll("Z", "")
    .replaceAll("/", "-");
};

export const getDay = (date: Date) => {
  const day = date.getDay();
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return days[day];
};

export const getFY = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  if (month < 3) {
    return year - 1;
  }
  return year;
};

export const extractUserInfo = (studentNo: string, needValid = true) => {
  // @ts-expect-error
  const department = DEPARTMENT_MAP[studentNo[0]];
  const grade = parseInt(studentNo.slice(1, 5), 10);
  const idValid = studentNo.at(-1) === "0";
  if (needValid && !idValid) {
    throw new Error(`Invalid \`enter\`: ${studentNo}`);
  }
  return {
    department,
    grade,
    studentNo: needValid ? studentNo.slice(0, -1) : studentNo,
  };
};

export const readTSV = (path: string) => {
  const tsv = Deno.readTextFileSync(path);
  const [header, ...body] = tsv
    .split("\n")
    .map((v) => v.split("\t").map((v) => v.trim()))
    .filter((v) => v.every((c) => c !== ""));

  const data = body.map((row) =>
    Object.fromEntries(row.map((v, i) => [header[i], v]))
  );

  return data;
};
