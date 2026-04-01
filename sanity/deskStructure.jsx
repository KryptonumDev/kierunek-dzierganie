import { collectionTypes, schemaTypes, singleTypes } from './schemas';

const previewBaseUrl = 'https://kierunek-dzierganie-git-dev-kryptonum.vercel.app/';

const getPreviewUrl = (pathname = '') => {
  return new URL(pathname, previewBaseUrl).toString();
};

const WebPreview = ({ document }) => {
  const {
    displayed: { _type, basis, slug },
  } = document;

  const type = _type + (basis ? `_${basis}` : '');

  const typeArray = {
    product_crocheting: '/produkty/szydelkowanie/',
    product_knitting: '/produkty/dzierganie/',
    product_other: '/produkty/inne/',
    product_instruction: '/produkty/instrukcje/',
    product_materials: '/produkty/pakiety-materialow/',
    course_crocheting: '/kursy-szydelkowania/',
    course_knitting: '/kursy-dziergania-na-drutach/',
    bundle_crocheting: '/kursy-szydelkowania/',
    bundle_knitting: '/kursy-dziergania-na-drutach/',
    voucher_crocheting: '/produkty/szydelkowanie/',
    voucher_knitting: '/produkty/dzierganie/',
    landingPage: '/landing/',
    CustomerCaseStudy_Collection: '/historia-kursantek/',
    BlogPost_Collection: '/blog/',
    homepage: '',
    KnittingProducts_Page: '/produkty/dzierganie',
    CrochetingProducts_Page: '/produkty/szydelkowanie',
    OtherProducts_Page: '/produkty/inne',
    Instructions_Page: '/produkty/instrukcje',
    MaterialsPackages_Page: '/produkty/pakiety-materialow',
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
    PartnershipProgram_Page: '/regulamin-programu-partnerskiego',
    StanVouchera_Page: '/stanvouchera',
    GuestThankYou_Page: '/dziekujemy-za-zamowienie',
    Blog_Page: '/blog',
  };

  const previewPath = typeArray[type];

  if (typeof previewPath !== 'string') {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        Nie udało się zbudować adresu podglądu dla tego dokumentu.
      </div>
    );
  }

  return (
    <iframe
      src={getPreviewUrl(`${previewPath}${slug?.current ?? ''}`)}
      style={{ width: '100%', height: '100%' }}
      frameBorder={0}
    />
  );
};

const OfferPreview = ({ document }) => {
  const {
    displayed: { _type, _id },
  } = document;

  const documentId = _id?.replace('drafts.', '');

  if (!documentId || (_type !== 'course' && _type !== 'bundle')) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        Podgląd oferty po zakupie jest dostępny tylko dla kursów i pakietów kursów.
      </div>
    );
  }

  return (
    <iframe
      src={getPreviewUrl(`/podglad/oferta-po-zakupie/${_type}/${documentId}`)}
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
        .views(
          [
            S.view.form().title('Edycja'),
            !withoutPreview.includes(name) && S.view.component(WebPreview).title('Podgląd'),
          ].filter(Boolean)
        )
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
            .views(
              [
                S.view.form().title('Edycja'),
                !withoutPreview.includes(name) && S.view.component(WebPreview).title('Podgląd'),
                (name === 'course' || name === 'bundle') &&
                  S.view.component(OfferPreview).title('Podgląd oferty po zakupie'),
              ].filter(Boolean)
            )
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
