export const BASE_URL = 'https://trainee-academy.devds.ru/';

export const BASE_API_URL = BASE_URL + 'api';

// export const projectUrl = 'project';

export const projectsUrl = '/project';

export const colorSchema = {
   priorities: [
      /** @description - высокий */ {
         color: '#FF5A4F',
         backgroundColor: '#FFF1F0',
      },
      /** @description - средний */ {
         color: '#FFA826',
         backgroundColor: '#FFF8EC',
      },
      /** @description - низкий */ {
         color: '#32C997',
         backgroundColor: '#F1FBF8',
      },
   ],
   taskTypes: [
      /** @description - баг */ { color: '#FF5A4F', backgroundColor: '#FFF1F0' },
      /** @description - задача */ { color: '#3787EB', backgroundColor: '#EEF5FC' },
      /** @description - улучшение */ { color: '#32C997', backgroundColor: '#F1FBF8' },
      /** @description - новая функциональность */ { color: '#FFA826', backgroundColor: '#FFF8EC' },
      /** @description - эпик */ { color: '#6457FA', backgroundColor: '#F0EEFF' },
      /** @description - релиз */ { color: '#FF6E41', backgroundColor: '#FFF1EC' },
      /** @description - гарантия */ { color: '#ABBED1', backgroundColor: '##F4F6F8' },
   ]
}


export const BYTES_IN_MB = 1048576;

export const MAX_FILE_SIZE = 10;
// export const MAX_FILE_SIZE = 2;
