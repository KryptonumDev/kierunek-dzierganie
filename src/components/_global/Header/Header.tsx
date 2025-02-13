import { Img_Query } from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import { PRODUCT_CARD_QUERY } from '@/global/constants';
import sanityFetch from '@/utils/sanity.fetch';
import { createClient as createAdminClient } from '@/utils/supabase-admin';
import { createClient } from '@/utils/supabase-server';
import Content from './_Content';
import type { QueryProps } from './Header.types';

const Header = async () => {
  const { global, cart, counts } = await query();
  const nav_annotation = <Markdown>{global.nav_Annotation ?? ''}</Markdown>;

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let data;

  if (user) {
    const response = await supabase
      .from('profiles')
      .select(
        `
          id,
          billing_data,
          shipping_data,
          virtual_wallet (
            amount
          ),
          courses_progress (
            course_id
          )
        `
      )
      .eq('id', user?.id)
      .single();

    data = response.data;
  }

  const adminClient = createAdminClient();

  const { data: deliverySettings } = await adminClient
    .from('settings')
    .select('value->deliveryPrice, value->paczkomatPrice')
    .eq('name', 'apaczka')
    .returns<{ deliveryPrice: number; paczkomatPrice: number }[]>()
    .single();

  const { data: freeShipping } = await adminClient
    .from('settings')
    .select('value->freeDeliveryAmount')
    .eq('name', 'general')
    .single();

  return (
    <Content
      global={global}
      markdownNavAnnotation={nav_annotation}
      Logo={[Logo1, Logo2]}
      SearchIcon={SearchIcon}
      CloseIcon={CloseIcon}
      ShoppingBagIcon={ShoppingBagIcon}
      ChatIcon={ChatIcon}
      UserIcon={UserIcon}
      ChevronDownIcon={ChevronDownIcon}
      ChevronBackIcon={ChevronBackIcon}
      VirtualCoinsCrossIcon={VirtualCoinsCrossIcon}
      NavigationCrossIcon={NavigationCrossIcon}
      PopupCrossIcon={PopupCrossIcon}
      PromoCodeCrossIcon={PromoCodeCrossIcon}
      cart={cart}
      counts={counts}
      userEmail={user?.email}
      shipping={data?.shipping_data}
      billing={data?.billing_data}
      userId={user?.id}
      deliverySettings={deliverySettings}
      // @ts-expect-error - virtual_wallet is not array, bug in supabase
      virtualWallet={data?.virtual_wallet?.amount}
      ownedCourses={data?.courses_progress?.map((course) => course.course_id as string)}
      freeShipping={(freeShipping?.freeDeliveryAmount as number) ?? 0}
    />
  );
};

export default Header;

const query = async (): Promise<QueryProps> => {
  const data = await sanityFetch<QueryProps>({
    query: /* groq */ `
      {
        "global": *[_id == 'global'][0] {
          nav_Annotation,
          image_crochet {
            ${Img_Query}
          },
          image_knitting {
            ${Img_Query}
          },
          nav_Links {
            name,
            href,
            sublinks {
              img {
                ${Img_Query}
              },
              name,
              href,
            }[],
          }[],
          nav_courses {
            knitting {
            href,
            highlighted_courses[]-> {
                name,
                slug,
                "image": gallery[0]{
                ${Img_Query}
              },
              },
          },
          crocheting {
            href,
            highlighted_courses[]-> {
                name,
                slug,
                "image": gallery[0]{
                ${Img_Query}
              },
            },
          },
          additional_links{
            name,
            href,
          }[],
        },
        nav_products {
          knitting {
            href,
            highlighted_products[]-> {
                name,
                slug,
                "image": imageKnitting {
                ${Img_Query}
              },
            },
          },
          crocheting {
            href,
            highlighted_products[]-> {
                name,
                slug,
                "image": imageCrocheting {
                ${Img_Query}
              },
            },
          },
          additional_links{
            name,
            href,
          }[],
        },
  },
        "cart": *[_id == 'Cart'][0]{
          highlighted[]-> {
            ${PRODUCT_CARD_QUERY}
          }
        },
        "counts": {
          "courses": {
            "crocheting": count(*[_type == "course" && basis == "crocheting"]),
            "knitting": count(*[_type == "course" && basis == "knitting"])
          },
          "products": {
            "crocheting": count(*[_type == "product" && basis == "crocheting"]),
            "knitting": count(*[_type == "product" && basis == "knitting"])
          }
        },
      }
    `,
    tags: ['global', 'Cart', 'course', 'product'],
  });
  return data;
};

const Logo1 = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={136}
    height={68}
    fill='none'
    viewBox='0 0 136 68'
  >
    <title>Kierunek Dzierganie</title>
    <path
      fill='#53423C'
      d='M9.752.32 9.703.305c-2.239-.578-4.074-.175-5.43.834-.604.45-1.1 1.02-1.495 1.66h-.005l-.075.127c-.033.06-.07.119-.1.178a14 14 0 0 0-1.25 2.874C.837 6.867.447 7.93.212 9.18c-.499 2.653-.085 4.639.903 6.056.94 1.346 2.366 2.123 3.894 2.484.028.02.054.044.083.062 1.941 1.43 4.327 2.128 6.622 1.746.07-.01.14-.029.207-.042 1.5 3.718 3.111 10.147 3.072 17.245-.38-1.288-1.06-2.943-2.184-3.671a2.1 2.1 0 0 0-1.753-.284c-.702.188-.909.586-.96.888-.269 1.603 3.544 4.322 4.722 5.117a.4.4 0 0 0 .114.05c-.295 5.574-1.679 11.427-4.968 16.622a.367.367 0 0 0 .62.392 30.8 30.8 0 0 0 3.008-6.222c.043 0 .085 0 .129-.013 1.355-.426 5.788-1.937 5.992-3.548a1 1 0 0 0 .008-.121c0-.292-.134-.671-.671-1.004a2.1 2.1 0 0 0-1.761-.23c-1.188.346-2.241 1.557-2.972 2.626 1.007-3.63 1.407-7.336 1.407-10.868 0-7.051-1.588-13.416-3.083-17.16 1.952-.59 3.752-2.016 5.053-4.443 2.133-3.981 1.813-7.418.597-9.964C17.093 2.39 15.024.74 13.615.314h-.01L13.598.31a6.03 6.03 0 0 0-3.842.01h-.005zm1.056 33.529q-.001-.034.005-.065.033-.194.426-.302a1.38 1.38 0 0 1 1.165.191c1.053.682 1.735 2.543 2.073 3.974-2.135-1.55-3.669-3.124-3.669-3.8zm6.68 11.562a1.38 1.38 0 0 1 1.17.15q.345.212.322.41c-.08.64-2.045 1.75-4.62 2.652.737-1.273 1.922-2.861 3.128-3.212M3.225 3.459q.048-.087.098-.173A5.3 5.3 0 0 1 4.704 1.72C5.696.98 7.015.596 8.665.833a5 5 0 0 0-.516.354q-.621.483-1.154 1.195c-1.245.114-2.446.504-3.499 1.227q-.28.193-.545.418.124-.293.274-.565zm11.717 4.126c.033 2.887-1.227 5.936-2.22 7.563-.437.715-1.485 1.36-2.867 1.745a10 10 0 0 1-.893.199c-.39-.132-.76-.33-1.095-.61-.617-.508-1.154-1.3-1.523-2.442l.204.072c2.453.803 4.033.537 4.983-.403.92-.908 1.123-2.336 1.123-3.552 0-2.629-1.81-4.397-3.46-5.056-.81-.325-1.673-.415-2.285-.106-.297.15-.521.395-.64.723.279-1.09.666-1.954 1.12-2.638a8.3 8.3 0 0 1 1.41.049c2.265.266 4.493 1.396 6.009 3.036q.127.694.134 1.42m.71-.336a6.7 6.7 0 0 1 .904 2.076c.387 1.611-.06 3.256-.987 4.645-.927 1.39-2.313 2.49-3.746 2.998a7 7 0 0 1-.46.142c.87-.405 1.58-.94 1.973-1.585 1.038-1.697 2.362-4.88 2.326-7.95 0-.109-.008-.217-.013-.326zm-6.798 3.835a.7.7 0 0 0 .451-.326c.093-.144.155-.328.2-.526a.365.365 0 0 0-.277-.432.365.365 0 0 0-.431.277 1 1 0 0 1-.088.266 1.2 1.2 0 0 1-.222-.223c-.403-.503-.932-1.608-1.485-3.302-.124-.382-.124-.648-.072-.823a.56.56 0 0 1 .305-.36c.34-.17.958-.16 1.69.132 1.444.579 3.006 2.12 3.006 4.385 0 1.185-.211 2.347-.909 3.036-.666.658-1.9.996-4.25.23a7 7 0 0 1-.66-.258 14 14 0 0 1-.29-2.549c-.051-1.82.088-3.318.364-4.55q-.043.448.132.98c.555 1.703 1.118 2.917 1.609 3.529.124.155.258.289.4.382a.72.72 0 0 0 .53.124zm.028-8.676a9 9 0 0 0-.924-.062q.308-.335.635-.588a4.8 4.8 0 0 1 1.19-.68c1.931.548 3.189 1.46 3.979 2.551.263.365.47.752.64 1.157-1.56-1.29-3.54-2.145-5.52-2.378M2.499 5.545a6.2 6.2 0 0 1 1.41-1.342 6.45 6.45 0 0 1 2.577-1.028C5.562 4.827 5 7.23 5.099 10.637c.021.756.088 1.446.191 2.078-2.372-1.551-3.266-4.534-2.79-7.17zm-.792 9.272C.91 13.678.504 12.05.842 9.78a10.46 10.46 0 0 0 2.75 6.65c-.747-.384-1.397-.913-1.885-1.613m3.676 2.241-.062-.015c-2.553-1.986-4.265-5.389-3.63-9.352.215 2.398 1.438 4.758 3.798 5.974.395 1.558 1.064 2.663 1.921 3.373q.124.104.256.196a9.3 9.3 0 0 1-2.28-.176zM13.375.996h.007L13.39 1c1.178.351 3.114 1.838 4.245 4.206 1.118 2.342 1.44 5.536-.581 9.31-1.412 2.634-3.4 3.948-5.461 4.292-1.63.27-3.33-.06-4.864-.86.743.036 1.487-.005 2.194-.119 1.01.284 2.105.189 3.145-.183 1.59-.566 3.101-1.769 4.108-3.28s1.531-3.36 1.087-5.215c-.297-1.24-.93-2.365-1.779-3.33a6.8 6.8 0 0 0-1.13-2.624c-.731-1.01-1.795-1.854-3.272-2.45a5.3 5.3 0 0 1 2.293.243zM43.315.02h-.893v12.257h.893V.021zm19.704 6.61a4.9 4.9 0 0 0 1.446-.364q.64-.286 1.092-.717.46-.442.702-1.023.244-.58.243-1.283 0-1.585-1.048-2.399-1.05-.822-3.171-.823h-3.127v12.256h.883V6.734h1.604q.355 0 .519.077a.85.85 0 0 1 .32.269l3.924 4.973q.096.121.191.172a.55.55 0 0 0 .243.052h.772l-4.219-5.3a1.4 1.4 0 0 0-.372-.347zm-.85-.555h-2.13V.723h2.244q1.639.001 2.494.632.856.633.857 1.942c0 .429-.077.81-.235 1.152q-.232.51-.684.875a3.1 3.1 0 0 1-1.092.563 5.1 5.1 0 0 1-1.456.19zm-28.849.037a.9.9 0 0 0-.32-.166q.155-.062.276-.155a2 2 0 0 0 .294-.268l5.353-5.5h-.718a.7.7 0 0 0-.294.06.9.9 0 0 0-.251.19l-4.947 5.085a1.3 1.3 0 0 1-.18.154 1 1 0 0 1-.192.104 1 1 0 0 1-.217.051 4 4 0 0 1-.286.008h-.728V0h-.883v12.275h.883V6.367h.787q.208 0 .346.026.139.015.235.07.105.043.18.113.08.069.174.165l5.19 5.301q.105.104.198.173.096.061.32.06h.718l-5.647-5.89a1.6 1.6 0 0 0-.294-.276zm14.649 6.165h7.345v-.736h-6.452v-5.11h5.37v-.72h-5.37V.756h6.452V.021H47.97zm64.059-5.889a1.6 1.6 0 0 0-.294-.276.9.9 0 0 0-.32-.166q.155-.062.276-.155c.085-.064.186-.152.294-.268l5.353-5.5h-.718a.7.7 0 0 0-.294.06.9.9 0 0 0-.251.19l-4.947 5.085a1.3 1.3 0 0 1-.181.154 1 1 0 0 1-.191.104 1 1 0 0 1-.217.051 5 5 0 0 1-.286.008h-.728V0h-.883v12.275h.883V6.367h.787q.21 0 .346.026a.6.6 0 0 1 .235.07q.104.043.181.113.078.069.173.165l5.19 5.301q.104.104.198.173.097.061.321.06h.717l-5.649-5.89zm-33.47 1.213a4.9 4.9 0 0 1-.26 1.604 3.7 3.7 0 0 1-.737 1.28q-.483.546-1.187.857a3.9 3.9 0 0 1-1.578.305q-.884 0-1.585-.312a3.4 3.4 0 0 1-1.178-.858 3.9 3.9 0 0 1-.736-1.28 5 5 0 0 1-.25-1.603V.023h-.89v7.58q-.001 1.014.32 1.898.32.874.919 1.533.608.651 1.464 1.023.865.372 1.941.372c1.076 0 1.36-.124 1.931-.372a4.2 4.2 0 0 0 1.465-1.023q.604-.659.926-1.533.321-.884.32-1.898V.024h-.882v7.58zm18.895 4.676h7.346v-.736h-6.453v-5.11h5.371v-.72h-5.37V.756h6.452V.021h-7.346zm-5.108-1.972c0 .162.007.327.025.503L84.436.188q-.077-.105-.147-.129a.44.44 0 0 0-.191-.033h-.434v12.256h.772V1.965q0-.235-.026-.493l7.97 10.637c.08.117.19.173.32.173h.424V.026h-.78v10.281zM57.048 31.092a.48.48 0 0 0 .478-.478c0-.085.39-.996.865-1.732.13-.173.044-.434-.13-.607a.55.55 0 0 0-.647.173c-.261.39-.997 1.689-.997 2.166 0 .261.217.478.434.478zm62.011 0a.48.48 0 0 0 .477-.478c0-.085.39-.996.865-1.732.129-.173.044-.434-.129-.607a.55.55 0 0 0-.65.173c-.261.39-.997 1.689-.997 2.166 0 .261.217.478.434.478m16.097 3.207a.454.454 0 0 0-.606.173c-2.513 3.725-4.896 5.933-6.324 5.933h-.087c-.434-.085-.909-.346-1.214-.953-.39-.563-.519-1.125-.692-1.776.865-.346 1.862-1.299 2.079-2.902.173-1.082-.086-2.035-.78-2.383-.434-.217-.865-.13-1.255.26-.356.382-.653 1.054-.837 1.86a59 59 0 0 1-2.703 3.642c-2.641 3.336-3.465 3.465-3.594 3.465-.39-.043-.692-.691-.78-1.949-.044-1.255.088-2.814.173-4.288 0-.39.044-.824.044-1.214v-.01q.194-.18.387-.339c.217-.087.261-.39.088-.606-.129-.173-.39-.217-.607-.088-1.04.78-2.078 2.078-3.075 3.248-.346.434-.65.824-.996 1.255-.346.346-.651.736-.953 1.04-.692.607-1.214.953-1.645.865-.823-.087-.865-1.82-.952-3.248-.173-1.861-.434-3.81-1.777-3.855-.953 0-1.732 1.038-2.468 3.032-.261.606-.434 1.213-.607 1.905 0-1.645-.173-3.377-.607-4.635-.129-.26-.39-.346-.65-.26-.217.129-.302.304-.261.563.268.614.418 1.396.496 2.23-.215.344-.468.765-.723 1.103a24 24 0 0 1-1.126 2.037c-.434.607-.865 1.255-1.299 1.82-.865 1.082-1.776 1.645-2.641 1.472-1.214-.346-1.604-2.252-1.604-4.678 0-1.645.173-3.465.39-5.198.044-.217-.129-.434-.346-.478-.26-.044-.477.088-.519.346-.129.475-.216 1.04-.302 1.56-.519 3.119-1.43 7.58-2.685 8.36-.13.173-.26.173-.39.13-.434-.13-.692-.997-.692-2.296 0-.865.13-1.993.434-3.204.607-2.427 1.386-3.465 1.647-3.336.302.044.173.65.173.65-.044.261.088.478.346.52.217.087.475-.086.52-.347.128-.475.128-1.515-.825-1.732-.4-.108-1.383.028-2.277 2.417-1.838 1.433-3.878 3.695-5.838 6.419v-3.465c0-2.947-.085-4.506-.562-4.981-.173-.13-.302-.217-.475-.217-.563.088-.953 1.04-1.56 3.204-.607 2.079-1.386 4.764-2.34 5.198a.46.46 0 0 1-.474 0c-.346-.13-.563-.953-.563-2.123 0-.823.088-1.861.346-2.99.65-2.729 1.56-4.115 2.037-4.115.563 0 .519.607.519 1.125 0 .261.217.478.478.478.26 0 .475-.217.433-.477-.129-1.777-.78-2.035-1.43-2.035s-1.255.607-1.82 1.56c-.39.908-.824 2.037-1.082 3.248-.217 1.04-.434 2.21-.434 3.248 0 1.386.346 2.512 1.17 2.858.39.173.823.173 1.255 0 .65-.302 1.17-1.17 1.603-2.21.475-1.04.824-2.34 1.17-3.55.216-.78.475-1.69.692-2.21.085.433.085 1.213.172 2.21v4.678c0 .563-.087 1.214-.087 1.862a67 67 0 0 0-3.984 6.886c-3.292 6.54-4.896 12.432-4.374 15.809.26 1.56.996 2.6 2.21 2.99.302.044.607.173.909.173.563 0 1.082-.217 1.603-.563 4.245-3.031 4.547-18.582 4.547-23.13 0-.65 0-1.254.044-1.905 1.72-2.576 3.584-4.828 5.355-6.41l-.013.043c-.26 1.082-.39 2.34-.39 3.421 0 1.56.346 2.903 1.343 3.163h.302c.302 0 .563-.044.824-.217.952-.606 1.644-2.339 2.078-4.33.173 2.642.868 4.072 2.252 4.506 1.254.302 2.383-.478 3.379-1.603.519-.563.997-1.255 1.472-1.994.434-.736.865-1.386 1.214-2.122l.01-.016v.016c.088 1.386 0 2.773-.085 3.638v.434c0 .26 0 .606.433.65h.044c.302 0 .39-.26.519-.563.044-.216.088-.475.217-.78.261-1.081.651-2.901 1.299-4.46.865-2.34 1.43-2.47 1.559-2.47.78.089.78 1.645.909 3.076 0 .477.129.953.129 1.342.044.475.129.91.302 1.255.217.78.607 1.343 1.387 1.472.692.088 1.43-.39 2.122-.997.39-.302.736-.736 1.041-1.125.953-1.04 1.732-2.079 2.6-3.075.059-.065.116-.124.175-.186v.317a29 29 0 0 0-.173 3.248c0 .563 0 1.04.044 1.516.129 1.299.519 2.251 1.516 2.34h.088c1.5 0 4.505-3.923 6.096-6.182v.03c0 1.214.261 2.513.909 3.595.433.824 1.169 1.299 1.993 1.299h.088c2.641.044 5.848-4.418 7.103-6.28a.55.55 0 0 0-.173-.65zM86.241 44.304c0 9.442-1.126 20.27-4.157 22.393q-.779.586-1.688.26c-.824-.26-1.43-.996-1.604-2.294-.736-4.418 2.858-13.558 7.45-20.834v.475zm40.687-11.046c.087-.088.129-.088.129-.088h.044c.216.088.433.651.346 1.43-.13.866-.607 1.777-1.299 2.167-.129-1.56.302-2.99.78-3.509M39.53 16.8c-2.815-.735-6.324 4.29-8.49 11.305.044-1.214.088-2.34.088-3.292 0-2.296-.173-3.855-.824-4.506-.217-.173-.475-.302-.78-.302-.217 0-.39.26-.346.478 0 .26.217.477.478.433l.044.044c.39.39.563 1.862.563 3.9 0 2.165-.173 4.98-.346 7.753-.868 3.248-2.167 6.757-2.946 9.398-.088.217.173.39.39.478.26 0 .474-.173.474-.434.088-.736 1.43-4.462 1.862-6.15-.217 2.946-.65 8.445-.692 10.093-.088-.088-.26-.13-.302-.217-.26-.085-.519-.044-.607.129-.173.26-.129.519.088.607.26.172.52.302.824.477-.044.434-.044.736-.044.953.044.26.217.434.475.39.26 0 .39-.217.39-.39v-.692c.39.085.736.173 1.04.173.651 0 1.214-.173 1.777-.39 1.82-.736 3.594-2.556 5.153-5.197 1.387-2.34 2.6-5.327 3.377-8.446.824-3.292 1.214-6.411 1.214-9.052 0-4.116-.953-7.06-2.858-7.537l-.003-.005zm.779 16.33c-1.43 5.542-4.374 11.693-7.97 13.08a4.25 4.25 0 0 1-2.425.172c.044-2.339.302-6.584.692-11.52.085-.692.13-1.43.173-2.123.173-.607.302-1.255.434-1.861 1.993-7.97 5.76-13.817 8.1-13.254 1.386.346 2.166 2.902 2.166 6.54 0 2.557-.346 5.676-1.17 8.965zm37.939 1.817c-.044.173.129.434.39.519.26.044.477-.088.519-.346.088-.39.129-.953.129-1.472 0-.692-.088-1.299-.52-1.689-.345-.39-.908-.475-1.603-.302-1.603.434-2.902 3.726-3.42 5.286 0-1.733-.174-2.946-.693-3.51-.173-.301-.519-.474-.823-.518-.261 0-.475.129-.475.39-.044.26.173.475.434.519.043 0 .085 0 .216.129.07.095.142.237.21.436a.5.5 0 0 0-.068.085c-2.512 3.726-4.895 5.934-6.323 5.934h-.088c-.433-.086-.908-.346-1.213-.953-.39-.563-.52-1.126-.692-1.776.865-.346 1.861-1.3 2.078-2.903.173-1.082-.087-2.034-.78-2.383-.433-.217-.864-.129-1.254.261-.357.382-.654 1.053-.837 1.859a59 59 0 0 1-2.703 3.643c-2.642 3.336-3.465 3.465-3.594 3.465-.39-.044-.692-.692-.78-1.95-.044-1.254.088-2.814.173-4.288 0-.39.044-.824.044-1.213 0-.261-.13-.476-.39-.476-.217 0-.434.13-.475.39-.044.434-.044.868-.044 1.3-.06.523-.1 1.047-.129 1.559-1.96-.055-5.311 1.33-9.897 4.115 4.028-5.241 6.238-8.445 5.242-9.442-.302-.302-.78-.217-1.255.044-.26.088-.52.26-.78.478-.302.217-.607.475-.997.736-.562.39-1.298.908-1.905 1.342-.692.39-1.255.736-1.776.78-.261 0-.39.26-.39.475.044.26.26.39.519.39 1.213-.13 2.729-1.299 4.072-2.296.65-.433 1.559-1.17 1.905-1.298 0 .217-.173.996-1.905 3.594-1.387 2.034-3.12 4.288-4.418 5.89l-.52.65c-.128.217-.128.434 0 .607.13.087.218.129.347.129.087 0 .173-.044.26-.044 3.848-2.479 8.875-5.296 11.462-5.242q-.009.404-.01.783c0 .563 0 1.04.043 1.515.13 1.3.52 2.252 1.516 2.34h.088c1.5 0 4.505-3.922 6.096-6.181v.03c0 1.214.26 2.513.909 3.594.433.824 1.17 1.3 1.993 1.3h.088c2.352.038 5.148-3.492 6.62-5.58.023.286.039.612.039.989 0 1.298-.173 3.119-.52 5.848v.088c-.087.26.13.475.39.475.217 0 .434-.173.434-.303.997-5.414 2.902-9.876 4.201-10.265.434-.044.607 0 .78.129.302.302.434 1.081.085 2.339zM64.92 33.258c.088-.088.129-.088.129-.088h.044c.217.088.434.651.346 1.43-.13.866-.607 1.777-1.299 2.167-.129-1.56.302-2.99.78-3.509'
    />
  </svg>
);

const Logo2 = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={133}
    height={69}
    viewBox='0 0 133 69'
    fill='none'
  >
    <title>Zrób Mi Mamo</title>
    <path
      d='M65.41 56.683v11.039h-.73v-8.865l-4.44 6.248h-.031L55.8 58.933v8.788h-.73V56.683h.015l5.14 7.312 5.17-7.312h.014Zm5.32.242V67.72h-.745V56.925z'
      fill='#53423C'
    />
    <path
      d='M65.41 56.683v11.039h-.73v-8.865l-4.44 6.248h-.031L55.8 58.933v8.788h-.73V56.683h.015l5.14 7.312 5.17-7.312h.014Zm5.32.242V67.72h-.745V56.925z'
      stroke='#53423C'
      strokeWidth={0.711}
      strokeMiterlimit={10}
    />
    <path
      d='m19.989 67.72-2.524-4.591q-.317.06-.805.06h-1.672v4.531h-.746V56.925h2.465q.85-.001 1.633.334a3 3 0 0 1 1.277 1.019q.494.684.494 1.703 0 .989-.456 1.786-.456.798-1.413 1.164l2.92 4.789zm-1.269-5.976q.631-.729.63-1.732 0-.64-.31-1.187a2.26 2.26 0 0 0-.89-.866q-.577-.32-1.339-.32h-1.823v4.835h1.626q1.475 0 2.106-.73Zm6.245-2.168a5.6 5.6 0 0 1 2.007-2.022 5.3 5.3 0 0 1 2.75-.753 5.37 5.37 0 0 1 2.769.753 5.6 5.6 0 0 1 2.022 2.022q.745 1.269.745 2.76t-.745 2.76a5.47 5.47 0 0 1-2.022 2.005 5.4 5.4 0 0 1-2.768.74 5.5 5.5 0 0 1-2.767-.715 5.3 5.3 0 0 1-2-1.978q-.736-1.26-.737-2.812 0-1.491.746-2.76Zm.653 5.161q.639 1.094 1.719 1.743 1.08.646 2.37.646 1.31 0 2.411-.64a4.7 4.7 0 0 0 1.741-1.74 4.73 4.73 0 0 0 .64-2.41 4.7 4.7 0 0 0-.647-2.41 4.9 4.9 0 0 0-1.74-1.756 4.6 4.6 0 0 0-2.39-.654q-1.305 0-2.4.66a4.8 4.8 0 0 0-1.72 1.773 4.83 4.83 0 0 0-.622 2.401q0 1.295.638 2.387Zm4.38-8.392h-.518l1.324-2.021h.805l-1.612 2.021Zm14.769 6.86q.602.683.602 1.642-.001.928-.472 1.58-.472.655-1.248.974a4.4 4.4 0 0 1-1.688.32h-2.813V56.924h2.388q3.285 0 3.285 2.737 0 .896-.42 1.575a2.44 2.44 0 0 1-1.207.993q.973.291 1.573.975Zm-4.874-1.232h1.993q1.094-.001 1.634-.593t.54-1.582q0-1.109-.654-1.634t-1.84-.524h-1.673zm3.954 4.501q.76-.565.76-1.597c0-.732-.271-1.277-.813-1.644q-.815-.545-1.908-.546h-1.993v4.35h2.038q1.156-.001 1.916-.563Z'
      fill='#53423C'
      stroke='#53423C'
      strokeWidth={0.711}
      strokeMiterlimit={10}
    />
    <path
      d='M1 57.28h8.222L1.89 67.413h8.445'
      stroke='#53423C'
      strokeWidth={1.422}
      strokeMiterlimit={10}
    />
    <path
      d='M101.733 65.183h-4.382l-1.213 2.995h-1.513l4.98-11.867h.096l4.98 11.867h-1.765zm-.52-1.323-1.624-4.16-1.687 4.161h3.311Zm20.714-4.266a6 6 0 0 1 2.12-2.136 5.6 5.6 0 0 1 2.908-.795q1.56 0 2.9.795a6.04 6.04 0 0 1 2.135 2.136 5.57 5.57 0 0 1 .796 2.898A5.65 5.65 0 0 1 132 65.41a5.8 5.8 0 0 1-2.137 2.12q-1.348.78-2.907.78a5.75 5.75 0 0 1-2.915-.771 5.76 5.76 0 0 1-2.9-5.045 5.6 5.6 0 0 1 .786-2.899Zm1.356 5.074a4.25 4.25 0 0 0 1.553 1.576 4.14 4.14 0 0 0 2.15.582q1.167 0 2.136-.573a4.17 4.17 0 0 0 1.529-1.576 4.4 4.4 0 0 0 .559-2.185q0-1.182-.569-2.188a4.2 4.2 0 0 0-1.543-1.592 4.1 4.1 0 0 0-2.144-.584 4.07 4.07 0 0 0-2.143.59 4.3 4.3 0 0 0-1.537 1.602 4.44 4.44 0 0 0-.559 2.19q0 1.164.568 2.158M91.8 56.809v11.038h-.73V58.98l-4.44 6.251h-.03l-4.41-6.173v8.788h-.73V56.809h.017l5.139 7.313 5.17-7.313zm26.131 0v11.038h-.729v-8.865l-4.44 6.25h-.03l-4.409-6.173v8.788h-.729V56.809h.014l5.139 7.313 5.172-7.313z'
      fill='#53423C'
    />
    <path
      d='M91.8 56.809v11.038h-.73V58.98l-4.44 6.251h-.03l-4.41-6.173v8.788h-.73V56.809h.017l5.139 7.313 5.17-7.313zm26.131 0v11.038h-.729v-8.865l-4.44 6.25h-.03l-4.409-6.173v8.788h-.729V56.809h.014l5.139 7.313 5.172-7.313z'
      stroke='#53423C'
      strokeWidth={0.711}
      strokeMiterlimit={10}
    />
    <path
      d='M57.567 13.811c-1.704-3.983-7.662-5.173-10.042-5.02-4.871.312-10.086 3.092-12.3 8.367-2.796 6.663.072 16.166 6.529 19.166 8.209 3.813 18.692-2.582 19.085-11.356.203-4.493-1.149-11.172-5.797-13.002-7.851-3.091-17.355 2.854-17.046 11.51.409 11.422 12.733 13.056 20.214 9.12 3.633-1.91 5.114-6.46 3.082-10.683-1.23-2.557-3.69-6.683-9.286-6.927-3.895-.17-11.007 1.587-10.84 9.87.083 4.081 2.616 6.587 5.758 6.764 3.402.193 9.593-2.64 10.293-6.27 1.27-6.601-5.989-9.1-9.44-6.016-6.276 5.607 10.204 11.204 7.948 4.938-1.506-4.184-10.675 6.27-3.883 5.27 2.2-.323 2.087-7.169-.552-7.948-2.5-.74-6.777 2.26-5.69 7.196 1.43 6.483 9.881 7.146 13.389 6.694 5.187-.67 9.455-2.26 14.642-6.108'
      stroke='#53423C'
      strokeWidth={0.611}
      strokeMiterlimit={10}
    />
    <path
      d='M73.21 29.69C83 22.772 87.36 14.67 87.594 7.448c.109-3.352-1.388-7.81-4.942-6.536-3.107 1.115-6.18 8.932-2.747 8.058.926-.392.098-2.43-.798-3.312-2.86-2.81-11.204-4.025-10.313 4.263.724 6.746 8.752 10.473 14.432 10.869 4.861.339 9.775-.928 14.068-3.111 2.806-1.427 6.006-3.164 8.366-4.745'
      stroke='#53423C'
      strokeWidth={0.611}
      strokeMiterlimit={10}
    />
  </svg>
);

const SearchIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='20'
    height='20'
    fill='none'
    viewBox='0 0 20 20'
  >
    <path
      stroke='#9A827A'
      strokeMiterlimit='10'
      d='M8.636 2.5a6.136 6.136 0 100 12.273 6.136 6.136 0 000-12.273z'
    ></path>
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      strokeMiterlimit='10'
      d='M13.21 13.214l4.287 4.286'
    ></path>
  </svg>
);
const CloseIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    fill='none'
    viewBox='0 0 24 24'
  >
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M17.25 17.25L6.75 6.75m10.5 0l-10.5 10.5'
    ></path>
  </svg>
);
const ChevronDownIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='11'
    height='6'
    fill='none'
    viewBox='0 0 11 6'
  >
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='0.75'
      d='M1.188.733l4.5 4.5 4.5-4.5'
    ></path>
  </svg>
);
const ChevronBackIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='13'
    height='8'
    fill='none'
    viewBox='0 0 13 8'
  >
    <path
      stroke='#53423C'
      strokeWidth='0.75'
      d='M13 4H1m0 0L3.063.875M1 4l2.063 3.125'
    ></path>
  </svg>
);
const NavigationCrossIcon = (
  <svg
    width='24'
    height='25'
    viewBox='0 0 24 25'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-label='Zamknij koszyk'
  >
    <path
      d='M17.25 17.5171L6.75 7.01709M17.25 7.01709L6.75 17.5171'
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const VirtualCoinsCrossIcon = (
  <svg
    width='24'
    height='25'
    viewBox='0 0 24 25'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-label='Zamknij okno z wirtualnymi monetami'
  >
    <path
      d='M17.25 17.5171L6.75 7.01709M17.25 7.01709L6.75 17.5171'
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const PopupCrossIcon = (
  <svg
    width='24'
    height='25'
    viewBox='0 0 24 25'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-label='Zamknij okno'
  >
    <path
      d='M17.25 17.5171L6.75 7.01709M17.25 7.01709L6.75 17.5171'
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
const PromoCodeCrossIcon = (
  <svg
    width='24'
    height='25'
    viewBox='0 0 24 25'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-label='Zamknij okno z kodem promocyjnym'
  >
    <path
      d='M17.25 17.5171L6.75 7.01709M17.25 7.01709L6.75 17.5171'
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const ChatIcon = (
  <svg
    width={25}
    height={24}
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M5.328 12a5 5 0 0 1 7 7m-7-7a4.993 4.993 0 0 0-1.999 4 5 5 0 0 0 .224 1.483c.273.88.076 1.86-.099 2.784a.468.468 0 0 0 .592.539c.848-.232 1.692-.43 2.557-.112A4.99 4.99 0 0 0 8.328 21a4.992 4.992 0 0 0 4-2m-7-7c0-4.685 2.875-9 8-9a8 8 0 0 1 7.532 10.7c-.476 1.326.037 3.102.337 4.568a.451.451 0 0 1-.583.526c-1.313-.41-2.853-.986-4.085-.466-1.335.562-2.737.672-4.201.672'
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const UserIcon = (
  <svg
    width={25}
    height={24}
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle
        cx={12.328}
        cy={9.1}
        r={2.5}
      />
      <path d='M17.328 19.2c-.317-6.187-9.683-6.187-10 0' />
      <path d='M10.04 3.64c.582-.495.873-.743 1.177-.888a2.577 2.577 0 0 1 2.223 0c.303.145.594.393 1.175.888.599.51 1.207.768 2.007.831.761.061 1.142.092 1.46.204.734.26 1.312.837 1.571 1.572.113.317.143.698.204 1.46.064.8.32 1.407.83 2.006.496.581.744.872.89 1.176.335.703.335 1.52 0 2.222-.146.304-.394.595-.89 1.176a3.305 3.305 0 0 0-.83 2.007c-.061.761-.091 1.142-.204 1.46a2.577 2.577 0 0 1-1.571 1.571c-.318.112-.699.143-1.46.204-.8.063-1.408.32-2.007.83-.58.496-.872.744-1.175.889a2.577 2.577 0 0 1-2.223 0c-.304-.145-.595-.393-1.176-.888a3.306 3.306 0 0 0-2.007-.831c-.761-.061-1.142-.092-1.46-.204a2.577 2.577 0 0 1-1.571-1.572c-.112-.317-.143-.698-.203-1.46a3.305 3.305 0 0 0-.832-2.006c-.495-.581-.743-.872-.888-1.176a2.577 2.577 0 0 1 0-2.222c.145-.304.393-.595.888-1.176.521-.611.769-1.223.832-2.007.06-.761.09-1.142.203-1.46a2.577 2.577 0 0 1 1.572-1.571c.317-.112.698-.143 1.46-.204a3.305 3.305 0 0 0 2.006-.83Z' />
    </g>
  </svg>
);

const ShoppingBagIcon = (
  <svg
    width={25}
    height={24}
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M9.263 7H8.101C7.03 7 6.14 7.81 6.063 8.857l-.73 10C5.25 20.016 6.186 21 7.371 21h9.914c1.186 0 2.122-.985 2.038-2.142l-.73-10C18.517 7.81 17.627 7 16.555 7h-1.162m-6.13 0V5c0-1.105.915-2 2.043-2h2.044c1.128 0 2.043.895 2.043 2v2m-6.13 0h6.13'
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
