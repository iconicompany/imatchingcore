import pandas as pd
import io
import csv
import sys
import os

# --- Data Loading ---
df_spec = pd.read_csv('specializations.csv')
df_cat = pd.read_csv('categories.csv')

# The source CSV only has 'Название' column
# We will just map to string category names directly

# --- Categorization Logic ---
def get_category(spec_name):
    name_lower = spec_name.lower()

    # Development - Specific Technologies/Frameworks
    if ".net" in name_lower or "c#" in name_lower:
        return "Back-end разработка"
    if "android" in name_lower:
        return "Мобильная разработка"
    if "ios" in name_lower or "macos" in name_lower:
        return "Мобильная разработка"
    if "java " in name_lower and "script" not in name_lower: # Avoid matching JavaScript
        return "Back-end разработка"
    if "php" in name_lower:
        return "Back-end разработка"
    if "python" in name_lower:
        return "Back-end разработка"
    if "react" in name_lower and "native" not in name_lower:
        return "Front-end разработка"
    if "react native" in name_lower:
         return "Мобильная разработка"
    if "angular" in name_lower:
        return "Front-end разработка"
    if "javascript" in name_lower or "js разработчик" in name_lower:
         return "Front-end разработка"
    if "fullstack" in name_lower or "full stack" in name_lower:
        return "Web-разработка"
    if "1с" in name_lower and ("разработчик" in name_lower or "эксперт" in name_lower or "консультант" in name_lower):
        return "1С разработка"
    if "c разработчик" in name_lower or "c++" in name_lower or "astra linux" in name_lower:
        return "Back-end разработка"
    if "atlassian" in name_lower:
        return "Back-end разработка" # Could be DevOps too
    if "delphi" in name_lower:
        return "Back-end разработка"
    if "embedded" in name_lower:
        return "Back-end разработка"
    if "flutter" in name_lower:
        return "Мобильная разработка"
    if "golang" in name_lower:
        return "Back-end разработка"
    if "kotlin" in name_lower:
        return "Мобильная разработка" # Also used in Backend
    if "dynamics" in name_lower or "bpmsoft" in name_lower or "camunda" in name_lower and "архитектор" not in name_lower:
        return "Back-end разработка"
    if "nestjs" in name_lower or "nodejs" in name_lower:
        return "Back-end разработка"
    if "oracle" in name_lower and "разработчик" in name_lower:
        return "Back-end разработка"
    if "pega" in name_lower:
        return "Back-end разработка"
    if "rpa" in name_lower:
        return "Back-end разработка"
    if "ruby" in name_lower:
        return "Back-end разработка"
    if "rust" in name_lower:
        return "Back-end разработка"
    if "scala" in name_lower:
        return "Back-end разработка"
    if "unity" in name_lower:
        return "Back-end разработка" # Game dev - using backend as placeholder
    if "vue.js" in name_lower:
        return "Front-end разработка"
    if "web разработчик" in name_lower:
        return "Web-разработка"
    if "xamarin" in name_lower:
        return "Мобильная разработка"
    if "битрикс" in name_lower:
        return "Web-разработка"
    if "low-code" in name_lower:
        return "Web-разработка"
    if "opentext" in name_lower:
         return "Back-end разработка"
    if "разработчик sql" in name_lower or "t-sql" in name_lower:
        return "Back-end разработка" # DB Dev
    if "разработчик игр" in name_lower:
        return "Back-end разработка" # Game dev - using backend as placeholder
    if "backend" in name_lower:
        return "Back-end разработка"
    if "frontend" in name_lower:
        return "Front-end разработка"
    if "sap" in name_lower and ("разработчик" in name_lower or "консультант" in name_lower):
         return "SAP разработка"
    if "hcm" in name_lower and "разработчик" in name_lower and "sap" not in name_lower: # Generic HCM dev
         return "Back-end разработка"
    if "инженер-программист" in name_lower or "программист-разработчик" in name_lower or "программист" == name_lower:
         return "Back-end разработка" # General dev -> Backend default

    # Analytics
    if "бизнес-аналитик" in name_lower:
        return "Бизнес-аналитика"
    if "системный аналитик" in name_lower or "бизнес/системный аналитик" in name_lower:
        return "Системная аналитика"
    if "data" in name_lower and ("аналитик" in name_lower or "scientist" in name_lower or "инженер" in name_lower or "quality" in name_lower):
        return "Аналитика данных"
    if "dwh" in name_lower or "etl" in name_lower or "bi" in name_lower or "ехд" in name_lower or "sas" in name_lower:
         return "Аналитика данных"
    if "продуктовый аналитик" in name_lower or "аналитик sql" in name_lower:
        return "Аналитика данных"
    if "web аналитик" in name_lower:
        return "Web-аналитика"
    if "аналитик 1с" in name_lower:
        return "Бизнес-аналитика" # Or System? Business seems better fit for 1C Analyst.
    if "ml" in name_lower and ("разработчик" in name_lower or "специалист" in name_lower):
         return "Аналитика данных"
    if "разработчик/аналитик данных" in name_lower:
         return "Аналитика данных"

    # DevOps / SRE / Admin
    if "devops" in name_lower or "девопс" in name_lower or "sre" in name_lower:
        return "Devops"
    if "администратор" in name_lower and "баз данных" in name_lower or "инженер бд" in name_lower:
        return "Администрирование БД"
    if "администратор" in name_lower and "teamcenter" in name_lower:
        return "Администрирование" # Specific system admin
    if "администратор" in name_lower and "тестовых сред" in name_lower:
        return "Devops" # Environment admin -> DevOps
    if "системный администратор" in name_lower or "сетевой инженер" in name_lower:
        return "Администрирование"
    if "системный инженер" in name_lower:
        return "Devops" # Often overlaps with SRE/DevOps roles
    if "инженер систем мониторинга" in name_lower:
        return "Devops"

    # Testing / QA
    if "тестировщик" in name_lower or "qa" in name_lower or "тест-менеджер" in name_lower or "специалист по тестированию" in name_lower:
        if "авто" in name_lower or "нагрузочный" in name_lower or "fullstack" in name_lower:
            return "Автоматизированное тестирование"
        if "ручной" in name_lower or "мобильный" in name_lower: # Default mobile QA to manual if not specified
            return "Ручное тестирование"
        # Generic QA/Tester
        return "Тестирование" # Use parent category for generics

    # Design / UX / UI
    if "дизайнер" in name_lower or "моделлер" in name_lower or "иллюстратор" in name_lower or "креативный продюсер" in name_lower:
        if "web" in name_lower:
            return "Web-дизайн"
        if "мобильный" in name_lower:
             return "Мобильный дизайн"
        if "ux/ui" in name_lower or "продуктовый дизайнер" in name_lower:
            return "Web-дизайн" # Default product/ui/ux designer to web
        if "графический" in name_lower or "презентаций" in name_lower or "3d" in name_lower or "иллюстратор" in name_lower or "креативный продюсер" in name_lower:
             return "Дизайн" # Use parent category
        return "Дизайн" # Fallback for generic designer
    if "ux" in name_lower:
        if "исследователь" in name_lower:
            return "UX исследования"
        if "проектировщик" in name_lower or "писатель" in name_lower:
            return "UX проектирование"
        return "Дизайн" # Fallback UX
    if "верстальщик" in name_lower:
        return "Front-end разработка" # Technically dev, not design

    # Management
    if "менеджер проекта" in name_lower or "администратор проектов" in name_lower or "scrum master" in name_lower:
        return "Проектный менеджмент"
    if "product owner" in name_lower or "менеджер продукта" in name_lower or "лидер по инновациям" in name_lower:
        return "Продуктовый менеджмент"
    if "руководитель" == name_lower: # Generic manager
        return "Управление продуктом и проектом"

    # Architecture
    if "архитектор" in name_lower:
        return "Архитектура"

    # Support / Maintenance
    if "сопровождения" in name_lower or "технической поддержки" in name_lower or "ит-специалист" in name_lower:
        return "Техническая поддержка"
    if "консультант" in name_lower and "directum" in name_lower or "elma" in name_lower:
         return "Техническая поддержка" # Non-SAP consultant -> Support
    if "технический писатель" in name_lower or "писатель" == name_lower: # Assume 'Писатель' is technical writer
        return "Сопровождение" # Documentation -> Support/Maintenance

    # Promotion
    if "seo" in name_lower or "контент-менеджер" in name_lower:
        return "Продвижение"

    # Security
    if "защите информации" in name_lower:
        return "Информационная безопасность"

    # Generic/Other
    if "инженер" == name_lower: # Very generic engineer
        return "Администрирование" # Default generic engineer to Admin/Ops

    # Roles to exclude / Uncategorized
    if "инженер-конструктор" in name_lower or \
       "менеджер по некоммерческим закупкам" in name_lower or \
       "начинающий специалист" in name_lower or \
       "менеджер по продажам" in name_lower:
        return ""

    # Fallback for anything missed (should be minimal)
    return ""

results = df_spec['Название'].apply(get_category)
df_spec['category'] = results
df_spec = df_spec.rename(columns={'Название': 'specialization'})

df_output = df_spec[['specialization', 'category']]

# Generate the CSV output separator ; and no id
# User wants exactly "specialization;category" in header
df_output.to_csv(sys.stdout, index=False, sep=';', lineterminator='\n')
