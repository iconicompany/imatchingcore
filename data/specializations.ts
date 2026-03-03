import * as fs from 'fs';

function getCategory(specName: string): string {
    const nameLower = specName.toLowerCase();

    // Development
    if (nameLower.includes(".net") || nameLower.includes("c#")) return "Back-end разработка";
    if (nameLower.includes("android")) return "Мобильная разработка";
    if (nameLower.includes("ios") || nameLower.includes("macos")) return "Мобильная разработка";
    if (nameLower.includes("java ") && !nameLower.includes("script")) return "Back-end разработка";
    if (nameLower.includes("php")) return "Back-end разработка";
    if (nameLower.includes("python")) return "Back-end разработка";
    if (nameLower.includes("react") && !nameLower.includes("native")) return "Front-end разработка";
    if (nameLower.includes("react native")) return "Мобильная разработка";
    if (nameLower.includes("angular")) return "Front-end разработка";
    if (nameLower.includes("javascript") || nameLower.includes("js разработчик")) return "Front-end разработка";
    if (nameLower.includes("fullstack") || nameLower.includes("full stack")) return "Web-разработка";
    if (nameLower.includes("1с") && (nameLower.includes("разработчик") || nameLower.includes("эксперт") || nameLower.includes("консультант"))) return "1С разработка";
    if (nameLower.includes("c разработчик") || nameLower.includes("c++") || nameLower.includes("astra linux")) return "Back-end разработка";
    if (nameLower.includes("atlassian")) return "Back-end разработка";
    if (nameLower.includes("delphi")) return "Back-end разработка";
    if (nameLower.includes("embedded")) return "Back-end разработка";
    if (nameLower.includes("flutter")) return "Мобильная разработка";
    if (nameLower.includes("golang")) return "Back-end разработка";
    if (nameLower.includes("kotlin")) return "Мобильная разработка";
    if (nameLower.includes("dynamics") || nameLower.includes("bpmsoft") || (nameLower.includes("camunda") && !nameLower.includes("архитектор"))) return "Back-end разработка";
    if (nameLower.includes("nestjs") || nameLower.includes("nodejs")) return "Back-end разработка";
    if (nameLower.includes("oracle") && nameLower.includes("разработчик")) return "Back-end разработка";
    if (nameLower.includes("pega")) return "Back-end разработка";
    if (nameLower.includes("rpa")) return "Back-end разработка";
    if (nameLower.includes("ruby")) return "Back-end разработка";
    if (nameLower.includes("rust")) return "Back-end разработка";
    if (nameLower.includes("scala")) return "Back-end разработка";
    if (nameLower.includes("unity")) return "Back-end разработка";
    if (nameLower.includes("vue.js")) return "Front-end разработка";
    if (nameLower.includes("web разработчик")) return "Web-разработка";
    if (nameLower.includes("xamarin")) return "Мобильная разработка";
    if (nameLower.includes("битрикс")) return "Web-разработка";
    if (nameLower.includes("low-code")) return "Web-разработка";
    if (nameLower.includes("opentext")) return "Back-end разработка";
    if (nameLower.includes("разработчик sql") || nameLower.includes("t-sql")) return "Back-end разработка";
    if (nameLower.includes("разработчик игр")) return "Back-end разработка";
    if (nameLower.includes("backend")) return "Back-end разработка";
    if (nameLower.includes("frontend")) return "Front-end разработка";
    if (nameLower.includes("sap") && (nameLower.includes("разработчик") || nameLower.includes("консультант"))) return "SAP разработка";
    if (nameLower.includes("hcm") && nameLower.includes("разработчик") && !nameLower.includes("sap")) return "Back-end разработка";
    if (nameLower.includes("инженер-программист") || nameLower.includes("программист-разработчик") || nameLower === "программист") return "Back-end разработка";

    // Analytics
    if (nameLower.includes("бизнес-аналитик")) return "Бизнес-аналитика";
    if (nameLower.includes("системный аналитик") || nameLower.includes("бизнес/системный аналитик")) return "Системная аналитика";
    if (nameLower.includes("data") && (nameLower.includes("аналитик") || nameLower.includes("scientist") || nameLower.includes("инженер") || nameLower.includes("quality"))) return "Аналитика данных";
    if (nameLower.includes("dwh") || nameLower.includes("etl") || nameLower.includes("bi") || nameLower.includes("ехд") || nameLower.includes("sas")) return "Аналитика данных";
    if (nameLower.includes("продуктовый аналитик") || nameLower.includes("аналитик sql")) return "Аналитика данных";
    if (nameLower.includes("web аналитик")) return "Web-аналитика";
    if (nameLower.includes("аналитик 1с")) return "Бизнес-аналитика";
    if (nameLower.includes("ml") && (nameLower.includes("разработчик") || nameLower.includes("специалист"))) return "Аналитика данных";
    if (nameLower.includes("разработчик/аналитик данных")) return "Аналитика данных";

    // DevOps / SRE / Admin
    if (nameLower.includes("devops") || nameLower.includes("девопс") || nameLower.includes("sre")) return "Devops";
    if ((nameLower.includes("администратор") && nameLower.includes("баз данных")) || nameLower.includes("инженер бд")) return "Администрирование БД";
    if (nameLower.includes("администратор") && nameLower.includes("teamcenter")) return "Администрирование";
    if (nameLower.includes("администратор") && nameLower.includes("тестовых сред")) return "Devops";
    if (nameLower.includes("системный администратор") || nameLower.includes("сетевой инженер")) return "Администрирование";
    if (nameLower.includes("системный инженер")) return "Devops";
    if (nameLower.includes("инженер систем мониторинга")) return "Devops";

    // Testing / QA
    if (nameLower.includes("тестировщик") || nameLower.includes("qa") || nameLower.includes("тест-менеджер") || nameLower.includes("специалист по тестированию")) {
        if (nameLower.includes("авто") || nameLower.includes("нагрузочный") || nameLower.includes("fullstack")) return "Автоматизированное тестирование";
        if (nameLower.includes("ручной") || nameLower.includes("мобильный")) return "Ручное тестирование";
        return "Тестирование";
    }

    // Design / UX / UI
    if (nameLower.includes("дизайнер") || nameLower.includes("моделлер") || nameLower.includes("иллюстратор") || nameLower.includes("креативный продюсер")) {
        if (nameLower.includes("web")) return "Web-дизайн";
        if (nameLower.includes("мобильный")) return "Мобильный дизайн";
        if (nameLower.includes("ux/ui") || nameLower.includes("продуктовый дизайнер")) return "Web-дизайн";
        if (nameLower.includes("графический") || nameLower.includes("презентаций") || nameLower.includes("3d") || nameLower.includes("иллюстратор") || nameLower.includes("креативный продюсер")) return "Дизайн";
        return "Дизайн";
    }
    if (nameLower.includes("ux")) {
        if (nameLower.includes("исследователь")) return "UX исследования";
        if (nameLower.includes("проектировщик") || nameLower.includes("писатель")) return "UX проектирование";
        return "Дизайн";
    }
    if (nameLower.includes("верстальщик")) return "Front-end разработка";

    // Management
    if (nameLower.includes("менеджер проекта") || nameLower.includes("администратор проектов") || nameLower.includes("scrum master")) return "Проектный менеджмент";
    if (nameLower.includes("product owner") || nameLower.includes("менеджер продукта") || nameLower.includes("лидер по инновациям")) return "Продуктовый менеджмент";
    if (nameLower === "руководитель") return "Управление продуктом и проектом";

    // Architecture
    if (nameLower.includes("архитектор")) return "Архитектура";

    // Support / Maintenance
    if (nameLower.includes("сопровождения") || nameLower.includes("технической поддержки") || nameLower.includes("ит-специалист")) return "Техническая поддержка";
    if (nameLower.includes("консультант") && (nameLower.includes("directum") || nameLower.includes("elma"))) return "Техническая поддержка";
    if (nameLower.includes("технический писатель") || nameLower === "писатель") return "Сопровождение";

    // Promotion
    if (nameLower.includes("seo") || nameLower.includes("контент-менеджер")) return "Продвижение";
    if (nameLower.includes("email-маркетолог") || nameLower.includes("контент-мейкер")) return "Контент-маркетинг";
    if (nameLower.includes("event-менеджер") || nameLower.includes("pr-менеджер") || nameLower.includes("gr-менеджер")) return "PR";
    if (nameLower.includes("smm")) return "SMM";
    if (nameLower.includes("бренд-менеджер") || nameLower.includes("маркетолог") || nameLower.includes("работе с crm")) return "Маркетинг";
    if (nameLower.includes("таргетолог")) return "Контекстная и таргетированная реклама";
    if (nameLower.includes("категорийный") || nameLower.includes("маркетплейса")) return "Продвижение на маркетплейсах";

    // HR & Admin
    if (nameLower.includes("бизнес-партнер") || nameLower.includes("корпоративный психолог")) return "Забота о персонале";
    if (nameLower.includes("рекрутер") || nameLower.includes("ресечер")) return "Подбор персонала";
    if (nameLower.includes("администратор 1с") || nameLower.includes("администратор отдела") || nameLower.includes("администратор офиса") || nameLower.includes("секретарь") || nameLower.includes("ассистент")) return "Кадровое администрирование";
    if (nameLower.includes("кадровый") || nameLower.includes("документообороту")) return "Кадровое администрирование";

    // Sales
    if (nameLower.includes("аккаунт менеджер") || nameLower.includes("ключевыми клиентами") || nameLower.includes("корпоративными клиентами") || nameLower.includes("лидогенерации") || nameLower.includes("тендерным продажам") || nameLower.includes("отдела продаж") || nameLower.includes("b2b")) return "B2B и B2C продажи";
    if (nameLower.includes("call-центра") || nameLower.includes("оператор")) return "Телемаркетинг и онлайн продажи";

    // Business/Finance/Legal
    if (nameLower.includes("аудитор")) return "Аудит и контроль";
    if (nameLower.includes("бухгалтер")) return "Бухгалтерский учет";
    if (nameLower.includes("управленческому учету")) return "Управленческий учет";
    if (nameLower.includes("финансовый консультант") || nameLower.includes("финансовый аналитик")) return "Финансовый анализ";
    if (nameLower.includes("юрист") || nameLower.includes("правовым")) return "Право и юриспруденция";

    // Creative / Media
    if (nameLower.includes("актер") || nameLower.includes("музыкант") || nameLower.includes("композитор") || nameLower.includes("аудиомонтажер") || nameLower.includes("звукорежиссер") || nameLower.includes("подкастер") || nameLower.includes("диктор")) return "Аудио";
    if (nameLower.includes("видеограф") || nameLower.includes("видеомонтажер") || nameLower.includes("клипмейкеры") || nameLower.includes("мультипликатор") || nameLower.includes("ретушер") || nameLower.includes("фотограф") || nameLower.includes("художник") || nameLower.includes("фотостудию")) return "Фото и видео";
    if (nameLower.includes("журналист") || nameLower.includes("копирайтер") || nameLower.includes("корректор") || nameLower.includes("редактор") || nameLower.includes("сценарист") || nameLower.includes("переводчик")) return "Тексты и переводы";

    // Execs and Directors
    if (nameLower.includes("директор по")) return "Функциональные директора";
    if (nameLower.includes("директор") || nameLower.includes("руководитель отдела персонала")) {
        if (nameLower.includes("коммерческий") || nameLower.includes("операционный") || nameLower.includes("финансовый") || nameLower.includes("корпоративный") || nameLower.includes("независимый") || nameLower.includes("ит-директор")) return "Исполнительные директора";
        return "Функциональные директора";
    }

    // Other New Tech / Specialized
    if (nameLower.includes("ai-разработчик") || nameLower.includes("llm") || nameLower.includes("генеративному ai") || nameLower.includes("ai-агентов") || nameLower.includes("математическому моделированию") || nameLower.includes("nlp/plp") || nameLower.includes("промпт-инженер")) return "Аналитика данных";
    if (nameLower.includes("gamedev") || nameLower.includes("insight") || nameLower.includes("siebel") || nameLower.includes("webtutor") || nameLower.includes("directum rx") || nameLower.includes("hp ium") || nameLower.includes("navision") || nameLower.includes("sharepoint") || nameLower.includes("офисных приложений") || nameLower.includes("чат-ботов") || nameLower.includes("oracle аналитик")) return "Back-end разработка";
    if (nameLower.includes("баз данных") && nameLower.includes("разработчик")) return "Back-end разработка";
    if (nameLower.includes("mlops")) return "Devops";
    if (nameLower.includes("wms аналитик") || nameLower.includes("sap commerce")) return "Бизнес-аналитика";
    if (nameLower.includes("продакшн-менеджер") || nameLower.includes("продюсер") || nameLower.includes("режиссер")) return "Проектный менеджмент";
    if (nameLower.includes("контролю качества")) return "Тестирование";
    if (nameLower.includes("тренер")) return "Обучение";
    if (nameLower.includes("itsm")) return "Техническая поддержка";

    // Generic/Other
    if (nameLower.includes("защите информации") || nameLower.includes("безопасности")) return "Информационная безопасность";
    if (nameLower.includes("инженер-конструктор") || nameLower.includes("микроконтроллеров") || nameLower.includes("метролог") || nameLower === "инженер") return "Инженеры";
    if (nameLower.includes("продажам") || nameLower.includes("сервис менеджер")) return "B2B и B2C продажи";
    if (nameLower.includes("логист") || nameLower.includes("закупкам")) return "Управление продуктом и проектом";
    if (nameLower.includes("руководитель проекта")) return "Проектный менеджмент";
    if (nameLower.includes("бизнес аналитик")) return "Бизнес-аналитика";

    // Roles to exclude / Uncategorized
    if (nameLower.includes("начинающий специалист")) return "";

    return "";
}

function parseSimpleCsv(csv: string) {
    return csv.trim().split('\n').map(line => {
        return line.trim().replace(/^"|"$/g, '');
    });
}

function run() {
    const specCsv = fs.readFileSync('specializations.csv', 'utf-8');
    const specs = parseSimpleCsv(specCsv);

    // Skip the first row "Название"
    const results: string[] = ["specialization;category"];

    for (let i = 1; i < specs.length; i++) {
        const specName = specs[i];
        if (!specName) continue;
        const category = getCategory(specName);
        results.push(`${specName};${category}`);
    }

    const outputCsv = results.join('\n') + '\n';
    fs.writeFileSync('specializations_categorized.csv', outputCsv);
    console.log("Done. Saved to specializations_categorized.csv");
}

run();
