import { collectionTypes, schemaTypes, singleTypes } from './schemas';

const url = 'https://kierunek-dzierganie-git-dev-kryptonum.vercel.app';
const WebPreview = ({ document }) => {
  const {
    displayed: { _type, basis, slug },
  } = document;

  const type = _type + (basis ? `_${basis}` : '');

  const typeArray = {
    product_crocheting: '/produkty-do-szydelkowania/',
    product_knitting: '/produkty-do-dziergania/',
    course_crocheting: '/kurs-szydelkowania/',
    course_knitting: '/kurs-dziergania-na-drutach/',
    bundle_crocheting: '/kurs-szydelkowania/',
    bundle_knitting: '/kurs-dziergania-na-drutach/',
    voucher_crocheting: '/produkty-do-szydelkowania/',
    voucher_knitting: '/produkty-do-dziergania/',
    landingPage: '/landing/',
    CustomerCaseStudy_Collection: '/historia-kursantek/',
    BlogPost_Collection: '/blog/',
    homepage: '',
    KnittingProducts_Page: '/produkty-do-dziergania',
    CrochetingProducts_Page: '/produkty-do-szydelkowania',
    KnittingCourses_Page: '/kursy-dziergania-na-drutach',
    CrochetingCourses_Page: '/kursy-szydelkowania',
    Team_Page: '/zespol',
    Contact_Page: '/kontakt',
    Partners_Page: '/partnerzy',
    OurBrands_Page: '/nasze-marki',
    Cooperation_Page: '/wspolpraca',
    Affiliate_Page: '/program-partnerski',
    Newsletter_Page: '/newsletter',
    NotFound_Page: '/not-found',
    PrivacyPolicy_Page: '/polityka-prywatnosci',
    Statute_Page: '/regulamin',
    StanVouchera_Page: '/stanvouchera',
    Blog_Page: '/blog',
  };

  return (
    <iframe
      src={url + typeArray[type] + (slug?.current ?? '')}
      style={{ width: '100%', height: '100%' }}
      frameBorder={0}
    />
  );
};

const createListItem = (S, typeName) => {
  const { title, name, icon } = schemaTypes.find(item => item.name === typeName);
  const withoutPreview = [
    'global',
    'Cart',
    'Courses_Page',
    'Orders_Page',
    'Data_Page',
    'Files_Page',
    'AffiliateDashboard_Page',
    'Support_Page',
    'Authorization_Page',
    'RegisterSuccess_Page',
    'ChangePasswordSuccess_Page',
    'ResetPassword_Page',
    'SetPassword_Page',
    'Logout_Page',
    'Delete_Page',
  ];
  return S.listItem()
    .title(title)
    .id(name)
    .icon(icon)
    .child(documentId =>
      S.document()
        .documentId(documentId)
        .schemaType(name)
        .title(title)
        .views([
          S.view.form().title('Edycja'),
          !withoutPreview.includes(name) && S.view.component(WebPreview).title('Podgląd'),
        ])
    );
};

const createDocumentTypeListItem = (S, name) => {
  const withoutPreview = [
    'lesson',
    'productReviewCollection',
    'ReviewCollection',
    'FaqCollection',
    'courseCategory',
    'productCategory',
    'Author_Collection',
    'Partner_Collection',
    'BlogCategory_Collection',
  ];

  return S.listItem()
    .title(collectionTypes.find(type => type.name === name).title)
    .icon(collectionTypes.find(type => type.name === name).icon)
    .child(
      S.documentTypeList(name)
        .title('Elementy')
        .child(documentId =>
          S.document()
            .documentId(documentId)
            .schemaType(name)
            .views([
              S.view.form().title('Edycja'),
              !withoutPreview.includes(name) && S.view.component(WebPreview).title('Podgląd'),
            ])
        )
    );
};

export const deskStructure = S =>
  S.list()
    .title('Struktura')
    .items([
      createListItem(S, 'global'),
      S.divider(),
      S.listItem()
        .title('Strona internetowa')
        .icon(() => '📄')
        .child(
          S.list()
            .title('Podstrony')
            .items([
              ...singleTypes.map(item => createListItem(S, item.name)),
              S.divider(),
              createDocumentTypeListItem(S, 'ReviewCollection'),
              createDocumentTypeListItem(S, 'FaqCollection'),
              createDocumentTypeListItem(S, 'CustomerCaseStudy_Collection'),
              createDocumentTypeListItem(S, 'Partner_Collection'),
              S.divider(),
              createDocumentTypeListItem(S, 'BlogPost_Collection'),
              createDocumentTypeListItem(S, 'BlogCategory_Collection'),
              createDocumentTypeListItem(S, 'Author_Collection'),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Strony użytkowników')
        .icon(() => '👤')
        .child(
          S.list()
            .title('Podstrony')
            .items([
              createListItem(S, 'Courses_Page'),
              createListItem(S, 'Orders_Page'),
              createListItem(S, 'Data_Page'),
              createListItem(S, 'Files_Page'),
              createListItem(S, 'AffiliateDashboard_Page'),
              createListItem(S, 'Support_Page'),
              S.divider(),
              createListItem(S, 'Authorization_Page'),
              createListItem(S, 'RegisterSuccess_Page'),
              createListItem(S, 'ChangePasswordSuccess_Page'),
              createListItem(S, 'ResetPassword_Page'),
              createListItem(S, 'SetPassword_Page'),
              S.divider(),
              createListItem(S, 'Logout_Page'),
              createListItem(S, 'Delete_Page'),
            ])
        ),
      S.divider(),
      createDocumentTypeListItem(S, 'landingPage'),
      S.divider(),
      createDocumentTypeListItem(S, 'thankYouPage'),
      S.divider(),
      S.listItem()
        .title('Sklep')
        .icon(() => '🛒')
        .child(
          S.list()
            .title('Elementy')
            .items([
              createDocumentTypeListItem(S, 'product'),
              createDocumentTypeListItem(S, 'course'),
              createDocumentTypeListItem(S, 'bundle'),
              createDocumentTypeListItem(S, 'voucher'),
              S.divider(),
              createDocumentTypeListItem(S, 'lesson'),
              S.divider(),
              createDocumentTypeListItem(S, 'productReviewCollection'),
              S.divider(),
              createDocumentTypeListItem(S, 'productCategory'),
              createDocumentTypeListItem(S, 'courseCategory'),
              S.divider(),
              createDocumentTypeListItem(S, 'CourseAuthor_Collection'),
            ])
        ),
    ]);
