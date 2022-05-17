import { Theme } from '@common/services/themeService';

// eslint-disable-next-line import/prefer-default-export
export const newThemes: Theme[] = [
  {
    id: 'e6e31160-fe79-4556-f3a9-08d86094b9e8',
    title: 'Early years (pre school)',
    summary:
      'Including early years foundation stage profile and early years surveys statistics',
    topics: [
      {
        id: '1003fa5c-b60a-4036-a178-e3a69a81b852',
        title: 'Childcare and early years',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: '0ce6a6c6-5451-4967-8dd4-2f4fa8131982',
            title: 'Education provision: children under 5 years of age',
            slug: 'education-provision-children-under-5',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '17b2e32c-ed2f-4896-852b-513cdf466769',
        title: 'Early years foundation stage profile',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: 'fcda2962-82a6-4052-afa2-ea398c53c85f',
            title: 'Early years foundation stage profile results',
            slug: 'early-years-foundation-stage-profile-results',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '778ec888-38c2-4709-7610-08d8609b1c22',
        title: 'Early years surveys',
        summary: '',
        publications: [
          {
            legacyPublicationUrl:
              'https://www.gov.uk/government/collections/statistics-childcare-and-early-years#childcare-and-early-years-providers-survey',
            type: 'Legacy',
            id: '79a08466-dace-4ff0-94b6-59c5528c9262',
            title: 'Childcare and early years provider survey',
            slug: 'childcare-and-early-years-provider-survey',
            isSuperseded: false,
          },
          {
            legacyPublicationUrl:
              'https://www.gov.uk/government/collections/statistics-childcare-and-early-years#childcare-and-early-years-providers-survey',
            type: 'Legacy',
            id: '060c5376-35d8-420b-8266-517a9339b7bc',
            title: 'Childcare and early years survey of parents',
            slug: 'childcare-and-early-years-survey-of-parents',
            isSuperseded: false,
          },
        ],
      },
    ],
  },
  {
    id: 'ee1855ca-d1e1-4f04-a795-cbd61d326a1f',
    title: 'Pupils and schools',
    summary:
      'Including absence, application and offers, capacity, exclusion and special educational needs (SEN) statistics',
    topics: [
      {
        id: '1c414644-7b87-4eff-ab41-08d93a1d641a',
        title: 'Academy transfers',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: '4e9eb1f5-8440-4e39-2d3e-08d93a1d8d28',
            title: 'Academy transfers and funding',
            slug: 'academy-transfers-and-funding',
            isSuperseded: false,
          },
        ],
      },
      {
        id: 'c9f0b897-d58a-42b0-9d12-ca874cc7c810',
        title: 'Admission appeals',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: '123461ab-50be-45d9-8523-c5241a2c9c5b',
            title: 'Admission appeals in England',
            slug: 'admission-appeals-in-england',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '77941b7d-bbd6-4069-9107-565af89e2dec',
        title: 'Exclusions',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: 'bf2b4284-6b84-46b0-aaaa-a2e0a23be2a9',
            title: 'Permanent exclusions and suspensions in England',
            slug: 'permanent-and-fixed-period-exclusions-in-england',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '6b8c0242-68e2-420c-910c-e19524e09cd2',
        title: 'Parental responsibility measures',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: '86af24dc-67c4-47f0-a849-e94c7a1cfe9b',
            title: 'Parental responsibility measures',
            slug: 'parental-responsibility-measures',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '67c249de-1cca-446e-8ccb-dcdac542f460',
        title: 'Pupil absence',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: 'cbbd299f-8297-44bc-92ac-558bcf51f8ad',
            title: 'Pupil absence in schools in England',
            slug: 'pupil-absence-in-schools-in-england',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: '14953fda-02ff-45ed-9573-3a7a0ad8cb10',
            title:
              'Pupil absence in schools in England: autumn and spring terms',
            slug: 'pupil-absence-in-schools-in-england-autumn-and-spring-terms',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: '6c388293-d027-4f74-8d74-29a42e02231c',
            title: 'Pupil absence in schools in England: autumn term',
            slug: 'pupil-absence-in-schools-in-england-autumn-term',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '5e196d11-8ac4-4c82-8c46-a10a67c1118e',
        title: 'Pupil projections',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: 'aa545525-9ffe-496c-a5b3-974ace56746e',
            title: 'National pupil projections',
            slug: 'national-pupil-projections',
            isSuperseded: false,
          },
        ],
      },
      {
        id: 'e50ba9fd-9f19-458c-aceb-4422f0c7d1ba',
        title: 'School and pupil numbers',
        summary: '',
        publications: [
          {
            type: 'AdHoc',
            id: '346a6978-9ee5-4b63-0ce1-08d88fd5ace1',
            title: 'Free school meals: Autumn term',
            slug: 'free-school-meals-autumn-term',
            isSuperseded: false,
          },
          {
            type: 'Experimental',
            id: '71cfcea3-359c-4089-722e-08da07fcb6c9',
            title: 'National Tutoring Programme',
            slug: 'national-tutoring-programme',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: 'a91d9e05-be82-474c-85ae-4913158406d0',
            title: 'Schools, pupils and their characteristics',
            slug: 'school-pupils-and-their-characteristics',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '1a9636e4-29d5-4c90-8c07-f41db8dd019c',
        title: 'School applications',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: '66c8e9db-8bf2-4b0b-b094-cfab25c20b05',
            title: 'Secondary and primary school applications and offers',
            slug: 'secondary-and-primary-school-applications-and-offers',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '87c27c5e-ae49-4932-aedd-4405177d9367',
        title: 'School capacity',
        summary: '',
        publications: [
          {
            type: 'AdHoc',
            id: '4cd161ca-468f-4023-9b91-08d8d4cdc4e0',
            title: ' School places sufficiency survey',
            slug: 'school-places-sufficiency-survey',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: '5c066362-9e14-4688-4f8a-08d83303033f',
            title: 'Local authority school places scorecards',
            slug: 'local-authority-school-places-scorecards',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: 'fa591a15-ae37-41b5-98f6-4ce06e5225f4',
            title: 'School capacity',
            slug: 'school-capacity',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '85349b0a-19c7-4089-a56b-ad8dbe85449a',
        title: 'Special educational needs (SEN)',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: '88312cc0-fe1d-4ab5-81df-33fd708185cb',
            title: 'Education, health and care plans',
            slug: 'education-health-and-care-plans',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: 'f657afb4-8f4a-427d-a683-15f11a2aefb5',
            title: 'Special educational needs in England',
            slug: 'special-educational-needs-in-england',
            isSuperseded: false,
          },
          {
            legacyPublicationUrl:
              'https://www.gov.uk/government/collections/statistics-special-educational-needs-sen#analysis-of-children-with-special-educational-needs',
            type: 'Legacy',
            id: '30874b87-483a-427e-8916-43cf9020d9a1',
            title:
              'Special educational needs: analysis and summary of data sources',
            slug:
              'special-educational-needs-analysis-and-summary-of-data-sources',
            isSuperseded: false,
          },
        ],
      },
    ],
  },
  {
    id: 'bc08839f-2970-4f34-af2d-29608a48082f',
    title: 'Teachers, workforce and school funding',
    summary: 'Including local authority (LA) and student loan statistics',
    topics: [
      {
        id: '4c658598-450b-4493-b972-8812acd154a7',
        title: 'Local authority and school finance',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: 'dcb8b32b-4e50-4fe2-a539-58f9b6b3a366',
            title: 'LA and school expenditure',
            slug: 'la-and-school-expenditure',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: '94d16c6e-1e5f-48d5-8195-8ea770f1b0d4',
            title: 'Planned LA and school expenditure',
            slug: 'planned-la-and-school-expenditure',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: '39dce2e3-4976-41ac-cb95-08d8bdf1a994',
            title: 'School funding statistics',
            slug: 'school-funding-statistics',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '5c5bc908-f813-46e2-aae8-494804a57aa1',
        title: 'Student loan forecasts',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: 'fd68e147-b7ee-464f-8b02-dcd917dc362d',
            title: 'Student loan forecasts for England',
            slug: 'student-loan-forecasts-for-england',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '0f8792d2-28b1-4537-a1b4-3e139fcf0ca7',
        title: 'Initial teacher training (ITT)',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: '465d5a87-dba8-49ee-b7e3-08d86b7beb8f',
            title: 'Initial Teacher Training Census',
            slug: 'initial-teacher-training-census',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: 'd34978d5-0317-46bc-9258-13412270ac4d',
            title: 'Initial teacher training performance profiles',
            slug: 'initial-teacher-training-performance-profiles',
            isSuperseded: false,
          },
          {
            legacyPublicationUrl:
              'https://www.gov.uk/government/collections/statistics-teacher-training#teacher-supply-model-and-itt-allocations',
            type: 'Legacy',
            id: '3ceb43d0-e705-4cb9-aeb9-cb8638fcbf3d',
            title: 'TSM and initial teacher training allocations',
            slug: 'tsm-and-initial-teacher-training-allocations',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '28cfa002-83cb-4011-9ddd-859ec99e0aa0',
        title: 'School workforce',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: 'b318967f-2931-472a-93f2-fbed1e181e6a',
            title: 'School workforce in England',
            slug: 'school-workforce-in-england',
            isSuperseded: false,
          },
        ],
      },
    ],
  },
  {
    id: '6412a76c-cf15-424f-8ebc-3a530132b1b3',
    title: 'Education outcomes and performance',
    summary:
      'Including not in education, employment or training (NEET) statistics',
    topics: [
      {
        id: '0b920c62-ff67-4cf1-89ec-0c74a364e6b4',
        title: 'Destinations of key stage 4 and 16-18 pupils',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: '657a20f6-13ef-494f-c9c0-08d82a49a1d0',
            title: '16-18 destination measures',
            slug: '16-18-destination-measures',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: 'b70e71fa-5767-4fb5-c9bf-08d82a49a1d0',
            title: 'Key stage 4 destination measures',
            slug: 'key-stage-4-destination-measures',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: '2ee2b32a-3fa0-42bb-c9c2-08d82a49a1d0',
            title: 'Longer term destinations',
            slug: 'longer-term-destinations',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: '61784b00-d1e7-4dbd-c9c1-08d82a49a1d0',
            title: 'Progression to higher education or training',
            slug: 'progression-to-higher-education-or-training',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '6a0f4dce-ae62-4429-834e-dd67cee32860',
        title: 'NEET and participation',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: '2e510281-ca8c-41bf-bbe0-fd15fcc81aae',
            title: 'NEET age 16 to 24',
            slug: 'neet-statistics-annual-brief',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: 'a0eb117e-44a8-4732-adf1-8fbc890cbb62',
            title: 'Participation in education and training and employment',
            slug: 'participation-in-education-and-training-and-employment',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '85b5454b-3761-43b1-8e84-bd056a8efcd3',
        title: '16 to 19 attainment',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: '3f3a66ec-5777-42ee-b427-8102a14ce0c5',
            title: 'A level and other 16 to 18 results',
            slug: 'a-level-and-other-16-to-18-results',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: '2e95f880-629c-417b-981f-0901e97776ff',
            title: 'Level 2 and 3 attainment age 16 to 25',
            slug: 'level-2-and-3-attainment-by-young-people-aged-19',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '1e763f55-bf09-4497-b838-7c5b054ba87b',
        title: 'GCSEs (key stage 4)',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: 'c8756008-ed50-4632-9b96-01b5ca002a43',
            title: 'Key stage 4 performance',
            slug: 'key-stage-4-performance-revised',
            isSuperseded: false,
          },
          {
            legacyPublicationUrl:
              'https://www.gov.uk/government/collections/statistics-gcses-key-stage-4#multi-academy-trust-performance-measures',
            type: 'Legacy',
            id: '1d0e4263-3d70-433e-bd95-f29754db5888',
            title: 'Multi-academy trust performance measures at key stage 4',
            slug: 'multi-academy-trust-performance-measures-at-ks4',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '504446c2-ddb1-4d52-bdbc-4148c2c4c460',
        title: 'Key stage 1',
        summary: '',
        publications: [
          {
            legacyPublicationUrl:
              'https://www.gov.uk/government/collections/statistics-key-stage-1#phonics-screening-check-and-key-stage-1-assessment',
            type: 'Legacy',
            id: '441a13f6-877c-4f18-828f-119dbd401a5b',
            title: 'Phonics screening check and key stage 1 assessments',
            slug: 'phonics-screening-check-and-key-stage-1-assessments',
            isSuperseded: false,
          },
        ],
      },
      {
        id: 'eac38700-b968-4029-b8ac-0eb8e1356480',
        title: 'Key stage 2',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: 'eab51107-4ef0-4926-8f8b-c8bd7f5a21d5',
            title: 'Multi-academy trust performance measures at key stage 2',
            slug: 'multi-academy-trust-performance-measures-at-ks2',
            isSuperseded: false,
          },
          {
            legacyPublicationUrl:
              'https://www.gov.uk/government/collections/statistics-key-stage-2#national-curriculum-assessments-at-key-stage-2',
            type: 'Legacy',
            id: '10370062-93b0-4dde-9097-5a56bf5b3064',
            title: 'National curriculum assessments at key stage 2',
            slug: 'national-curriculum-assessments-at-key-stage-2',
            isSuperseded: false,
          },
        ],
      },
    ],
  },
  {
    id: '92c5df93-c4da-4629-ab25-51bd2920cdca',
    title: 'Further education',
    summary:
      'Including advanced learner loan, benefit claimant and apprenticeship and traineeship statistics',
    topics: [
      {
        id: 'dd4a5d02-fcc9-4b7f-8c20-c153754ba1e4',
        title: 'FE choices',
        summary: '',
        publications: [
          {
            legacyPublicationUrl:
              'https://www.gov.uk/government/collections/fe-choices#learner-satisfaction-survey-data',
            type: 'Legacy',
            id: '657b1484-0369-4a0e-873a-367b79a48c35',
            title: 'FE choices learner satisfaction survey',
            slug: 'fe-choices-learner-satisfaction-survey',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '88d08425-fcfd-4c87-89da-70b2062a7367',
        title: 'Further education and skills',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: 'cf0ec981-3583-42a5-b21b-3f2f32008f1b',
            title: 'Apprenticeships and traineeships',
            slug: 'apprenticeships-and-traineeships',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: 'c858107c-1b98-4818-2731-08d8a11fd8ef',
            title: 'Apprenticeships in England by industry characteristics ',
            slug: 'apprenticeships-in-england-by-industry-characteristics',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: '13b81bcb-e8cd-4431-9807-ca588fd1d02a',
            title: 'Further education and skills',
            slug: 'further-education-and-skills',
            isSuperseded: false,
          },
          {
            type: 'AdHoc',
            id: 'ce8ef30f-1b14-45d4-4854-08d99eeed35d',
            title: 'Skills Bootcamps outcomes',
            slug: 'skills-bootcamps-outcomes',
            isSuperseded: false,
          },
        ],
      },
      {
        id: 'a7ce9542-20e6-401d-91f4-f832c9e58b12',
        title: 'Further education outcomes',
        summary: '',
        publications: [
          {
            type: 'AdHoc',
            id: '1aa10012-ee64-4ece-f4b1-08d8b7d3c33b',
            title:
              'FE learners going into employment and learning destinations by local authority district',
            slug:
              'fe-learners-going-into-employment-and-learning-destinations-by-local-authority-district',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: 'b2eed9e7-3845-47ab-e9a9-08d9a8ec2f9e',
            title: 'Further education skills index',
            slug: 'further-education-skills-index',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: '8b12776b-3d36-4475-8115-00974d7de1d0',
            title: 'Further education: outcome-based success measures',
            slug: 'further-education-outcome-based-success-measures',
            isSuperseded: false,
          },
        ],
      },
    ],
  },
  {
    id: '2ca22e34-b87a-4281-a0eb-b80f4f8dd374',
    title: 'Higher education',
    summary:
      'Including university graduate employment, graduate labour market and participation statistics',
    topics: [
      {
        id: '68a05736-c76f-4902-260e-08d9a364ecbe',
        title: 'Education exports',
        summary: '',
        publications: [
          {
            type: 'Experimental',
            id: '04b59c44-bfb8-4d7d-841d-08d9a365444f',
            title:
              'UK revenue from education related exports and transnational education activity',
            slug:
              'uk-revenue-from-education-related-exports-and-transnational-education-activity',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '53a1fbb7-5234-435f-892b-9baad4c82535',
        title: 'Higher education graduate employment and earnings',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: '42a888c4-9ee7-40fd-9128-f5de546780b3',
            title: 'Graduate labour market statistics',
            slug: 'graduate-labour-markets',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: '2d629fad-d66d-46d8-849d-08d8b249ed05',
            title: 'Graduate outcomes (LEO)',
            slug: 'graduate-outcomes-leo',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: '4d29c28c-efd1-4245-a80c-b55c6a50e3f7',
            title: 'Graduate outcomes (LEO): postgraduate outcomes',
            slug: 'graduate-outcomes-leo-postgraduate-outcomes',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: 'f27b380e-98a6-4b1a-9d98-f7b7a5392032',
            title: 'Graduate outcomes (LEO): Provider level data',
            slug: 'graduate-outcomes-leo-provider-level-data',
            isSuperseded: false,
          },
        ],
      },
      {
        id: 'a2b3e3a5-82cc-4a60-13ff-08d968ac3fa3',
        title: 'Higher level learners in England',
        summary: '',
        publications: [
          {
            type: 'AdHoc',
            id: 'e926dcde-e610-4721-ea39-08d968ac9105',
            title: 'Higher Level Learners in England',
            slug: 'higher-level-learners-in-england',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '04d95654-9fe0-4f78-9dfd-cf396661ebe9',
        title: 'Participation measures in higher education',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: '0c67bbdb-4eb0-41cf-a62e-2589cee58538',
            title: 'Participation measures in higher education',
            slug: 'participation-measures-in-higher-education',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '7871f559-0cfe-47c0-b48d-25b2bc8a0418',
        title: 'Widening participation in higher education',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: 'c28f7aca-f1e8-4916-8ce3-fc177b140695',
            title: 'Widening participation in higher education',
            slug: 'widening-participation-in-higher-education',
            isSuperseded: false,
          },
        ],
      },
    ],
  },
  {
    id: 'cc8e02fd-5599-41aa-940d-26bca68eab53',
    title: "Children's social care",
    summary:
      'Including children in need and child protection, children looked after and social work workforce statistics',
    topics: [
      {
        id: '22c52d89-88c0-44b5-96c4-042f1bde6ddd',
        title: 'Children in need and child protection',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: '89869bba-0c00-40f7-b7d6-e28cb904ad37',
            title: 'Characteristics of children in need',
            slug: 'characteristics-of-children-in-need',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '66ff5e67-36cf-4210-9ad2-632baeb4eca7',
        title: 'Children looked after',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: '3260801d-601a-48c6-93b7-cf51680323d1',
            title: 'Children looked after in England including adoptions',
            slug: 'children-looked-after-in-england-including-adoptions',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '734820b7-f80e-45c3-bb92-960edcc6faa5',
        title: "Children's social work workforce",
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: 'd8baee79-3c88-45f4-b12a-07b91e9b5c11',
            title: "Children's social work workforce",
            slug: 'children-s-social-work-workforce',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '3dd56116-a8ef-4e17-7611-08d8609b1c22',
        title: 'Outcomes for children in social care',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: 'f51895df-c682-45e6-b23e-3138ddbfdaeb',
            title:
              'Outcomes for children in need, including children looked after by local authorities in England',
            slug:
              'outcomes-for-children-in-need-including-children-looked-after-by-local-authorities-in-england',
            isSuperseded: false,
          },
          {
            type: 'AdHoc',
            id: 'ea42de23-80c0-4609-89fe-91df00c4f249',
            title:
              'Outcomes of children in need, including looked after children',
            slug:
              'outcomes-of-children-in-need-including-looked-after-children',
            isSuperseded: false,
          },
        ],
      },
      {
        id: 'd5288137-e703-43a1-b634-d50fc9785cb9',
        title: "Secure children's homes",
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: 'd7bd5d9d-dc65-4b1d-99b1-4d815b7369a3',
            title: "Children accommodated in secure children's homes",
            slug: 'children-accommodated-in-secure-childrens-homes',
            isSuperseded: false,
          },
        ],
      },
      {
        id: 'c2262c88-3b8e-4473-17d4-08d876964ff4',
        title: 'Serious incident notifications',
        summary: '',
        publications: [
          {
            type: 'Experimental',
            id: '0c2da30b-0210-49d4-cac0-08d87696e25e',
            title: 'Serious incident notifications',
            slug: 'serious-incident-notifications',
            isSuperseded: false,
          },
        ],
      },
    ],
  },
  {
    id: '2eee78b2-e4d5-4046-9866-c6c5b717a96c',
    title: 'COVID-19',
    summary:
      'Including Attendance in education and early years settings during the coronavirus (COVID-19) outbreak',
    topics: [
      {
        id: 'fc4e0989-0f24-4a99-a13c-b57e37032863',
        title: 'Attendance',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: '036e2c36-7c48-4a29-8419-a3939be9e173',
            title:
              'Attendance in education and early years settings during the coronavirus (COVID-19) pandemic',
            slug:
              'attendance-in-education-and-early-years-settings-during-the-coronavirus-covid-19-outbreak',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '89e9c50b-483a-4db1-ba96-08d999fb118d',
        title: 'CO2 monitors',
        summary: '',
        publications: [
          {
            type: 'ManagementInformation',
            id: '4b2e6dfd-69c8-42d7-8fac-08d999fbf656',
            title: 'CO2 monitors: cumulative delivery statistics',
            slug: 'co2-monitors-cumulative-delivery-statistics',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '8e0e8f63-3fe0-4ee4-98ae-08d88f976edd',
        title: 'Confirmed cases reported by Higher Education providers',
        summary: '',
        publications: [
          {
            type: 'AdHoc',
            id: '359958a5-b28a-4ab3-508a-08d88f97dffc',
            title:
              'Coronavirus (COVID-19) Reporting in Higher Education Providers',
            slug:
              'coronavirus-covid-19-reporting-in-higher-education-providers',
            isSuperseded: false,
          },
        ],
      },
      {
        id: '7db5741e-b983-48a5-5ee4-08d8b87a887d',
        title: 'Devices',
        summary: '',
        publications: [
          {
            type: 'ManagementInformation',
            id: '1c45fcd7-e1ca-44d2-b4c8-08d9ec8bbabe',
            title: 'Delivery of air cleaning units',
            slug: 'delivery-of-air-cleaning-units',
            isSuperseded: false,
          },
          {
            type: 'NationalAndOfficial',
            id: '4d747ecd-10cc-4660-bcdc-08d8b9339e60',
            title: 'Laptops and tablets data',
            slug: 'laptops-and-tablets-data',
            isSuperseded: false,
          },
        ],
      },
      {
        id: 'ba9a866c-a8b4-4e3f-697a-08d8a751a48d',
        title: 'Testing',
        summary: '',
        publications: [
          {
            type: 'AdHoc',
            id: '6d2ff07c-7ea9-43c0-6937-08d8cddbb024',
            title: 'COVID mass testing data in education',
            slug: 'covid-mass-testing-data-in-education',
            isSuperseded: false,
          },
        ],
      },
    ],
  },
  {
    id: 'a95d2ca2-a969-4320-b1e9-e4781112574a',
    title: 'Cross-cutting publications',
    summary:
      'Including summarised expenditure, post-compulsory education, qualification and school statistics',
    topics: [
      {
        id: '692050da-9ac9-435a-80d5-a6be4915f0f7',
        title: 'UK education and training statistics',
        summary: '',
        publications: [
          {
            type: 'NationalAndOfficial',
            id: '2ffbc8d3-eb53-4c4b-a6fb-219a5b95ebc8',
            title: 'Education and training statistics for the UK',
            slug: 'education-and-training-statistics-for-the-uk',
            isSuperseded: false,
          },
        ],
      },
    ],
  },
];
