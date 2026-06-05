import { SpecializationsMatchingFactory } from '../src/specializations/specializations-matching-factory';

const engine = await SpecializationsMatchingFactory.create();

const tests = [
    "QA-engineer 879",
    "Тестировщик 326012",
    "QA Engineer 320166",
    "Специалист по тестированию 319928",
    "QA engineer ID 3810",
    "Тестировщик + ТА, Senior ГС-0001",
    "Senior QA тестировщик 4078",
    "Тестировщик 312429",
    "QA engineer #873",
    "QA-инженер #846",
    "QA engineer ID 3748",
    "QA НТ тестировщик Senior 2896",
    "Senior QA тестировщик (Мосбиржа) 2820",
    "QA (нагрузочное тестирование) lead #17244",
    "AQA (Python) Middle+/Senior id313",
    "QA auto engineer (SDET) #216131",
    "QA тестировщик Middle/Senior (МТС Диджитал) 2480",
    "QA Middle+/Senior 409",
    "QA middle+/senior #17856",
    "QA (Middle - Senior) ВЗ-0208",
    "QA Engineer, Middle/Senior ВЗ-0358",
    "Data QA Engineer Middle+ #13441",
    "AQA Python (Tele2) ID2322",
    "Senior AQA (Python) # МТС",
    "Сетевой инженер Senior ID 392",
    "Senior Сетевой инженер 4358",
    "Go-разработчик senior + с опытом на Java и React ID: 431",
    "Разработчик DocsVision (Мосбиржа) 3198",
    "Разработчик Diasoft ID 13502",
    "Support Engineer 32900",
    "Machine learning Engineer 13671",
    "Специалист по ИБ 2756",
    "Менеджер проекта 13636",
    "Support Engineer L3",
    "DevSecOps",
    "Инженер SOC ID 71711",
    "Middle Разработчика АБС ЦФТ ID 71092",
    "Инженер систем БД",
    "Senior Сетевого инженера ID 73698",
];

console.log('| Input | Result | Score |');
console.log('| ----- | ------ | ----- |');
for (const t of tests) {
    const r = engine.match(t);
    console.log(`| ${t} | ${r?.specialization ?? '---'} | ${r?.score.toFixed(2) ?? '0.00'} |`);
}
