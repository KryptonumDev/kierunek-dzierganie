import sanityFetch from '@/utils/sanity.fetch';
import { draftMode } from 'next/headers';
import type { QueryProps } from './Header.types';
import Content from './_Content';
import Markdown from '@/components/ui/markdown';

const Header = async () => {
  const { global, cart }: QueryProps = await query();
  const nav_annotation = <Markdown>{global.nav_Annotation ?? ''}</Markdown>;
  return (
    <Content
      global={global}
      markdownNavAnnotation={nav_annotation}
      cart={cart}
      Logo={Logo}
      SearchIcon={SearchIcon}
      CloseIcon={CloseIcon}
      ChevronDownIcon={ChevronDownIcon}
      ChevronBackIcon={ChevronBackIcon}
    />
  );
};

export default Header;

const query = async (): Promise<QueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
    {
    "cart": *[_id== 'cart'][0]{
      image_crochet{
        asset -> {
          url,
          altText,
          metadata {
            lqip,
            dimensions {
              width,
              height,
            }
          }
        }
      },
      image_knitting{
        asset -> {
          url,
          altText,
          metadata {
            lqip,
            dimensions {
              width,
              height,
            }
          }
        }
      },
      highlighted_products[]->{
        _id,
        type,
        basis,
        name,
        price,
        discount,
        countInStock,
        'slug': slug.current,
        gallery[0]{
          asset -> {
            url,
            altText,
            metadata {
              lqip,
              dimensions {
                width,
                height,
              }
            }
          }
        },
        variants[]{
          price,
          discount,
          countInStock,
          gallery[0]{
            asset -> {
              url,
              altText,
              metadata {
                lqip,
                dimensions {
                  width,
                  height,
                }
              }
            }
          }
        }
      },
    },
    "global":  *[_id == 'global'][0] {
        nav_Annotation,
        nav_Links {
          name,
          href,
          sublinks {
            img {
              asset -> {
                url,
                altText,
                metadata {
                  lqip,
                  dimensions {
                    width,
                    height,
                  }
                }
              }
            },
            name,
            href,
          }[]
        }[]
      }
    }`,
    isDraftMode: draftMode().isEnabled,
  });
  return data as QueryProps;
};

const Logo = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='136'
    height='68'
    fill='none'
    viewBox='0 0 136 68'
  >
    <path
      fill='#53423C'
      d='M9.752.32L9.703.305c-2.239-.578-4.074-.175-5.43.834-.604.45-1.1 1.02-1.495 1.66h-.005c-.026.042-.049.083-.075.127-.033.06-.07.119-.1.178a14.086 14.086 0 00-1.25 2.874C.837 6.867.447 7.93.212 9.18c-.499 2.653-.085 4.639.903 6.056.94 1.346 2.366 2.123 3.894 2.484.028.02.054.044.083.062 1.941 1.43 4.327 2.128 6.622 1.746.07-.01.14-.029.207-.042 1.5 3.718 3.111 10.147 3.072 17.245-.38-1.288-1.06-2.943-2.184-3.671a2.107 2.107 0 00-1.753-.284c-.702.188-.909.586-.96.888-.269 1.603 3.544 4.322 4.722 5.117a.4.4 0 00.114.05c-.295 5.574-1.679 11.427-4.968 16.622a.367.367 0 00.62.392 30.79 30.79 0 003.008-6.222c.043 0 .085 0 .129-.013 1.355-.426 5.788-1.937 5.992-3.548a.922.922 0 00.008-.121c0-.292-.134-.671-.671-1.004a2.1 2.1 0 00-1.761-.23c-1.188.346-2.241 1.557-2.972 2.626 1.007-3.63 1.407-7.336 1.407-10.868 0-7.051-1.588-13.416-3.083-17.16 1.952-.59 3.752-2.016 5.053-4.443 2.133-3.981 1.813-7.418.597-9.964C17.093 2.39 15.024.74 13.615.314h-.01L13.598.31a6.03 6.03 0 00-3.842.01h-.005zm1.056 33.529c0-.023 0-.044.005-.065.021-.129.165-.23.426-.302a1.38 1.38 0 011.165.191c1.053.682 1.735 2.543 2.073 3.974-2.135-1.55-3.669-3.124-3.669-3.8v.002zm6.68 11.562a1.377 1.377 0 011.17.15c.23.142.337.278.322.41-.08.64-2.045 1.75-4.62 2.652.737-1.273 1.922-2.861 3.128-3.212zM3.225 3.459c.033-.057.064-.116.098-.173A5.309 5.309 0 014.704 1.72C5.696.98 7.015.596 8.665.833a5.395 5.395 0 00-.516.354c-.413.323-.8.72-1.154 1.195-1.245.114-2.446.504-3.499 1.227-.186.129-.37.268-.545.418.083-.194.173-.385.274-.565v-.003zm11.717 4.126c.033 2.887-1.227 5.936-2.22 7.563-.437.715-1.485 1.36-2.867 1.745a9.46 9.46 0 01-.893.199c-.39-.132-.76-.33-1.095-.61-.617-.508-1.154-1.3-1.523-2.442.067.023.134.049.204.072 2.453.803 4.033.537 4.983-.403.92-.908 1.123-2.336 1.123-3.552 0-2.629-1.81-4.397-3.46-5.056-.81-.325-1.673-.415-2.285-.106-.297.15-.521.395-.64.723.279-1.09.666-1.954 1.12-2.638a8.333 8.333 0 011.41.049c2.265.266 4.493 1.396 6.009 3.036.085.462.129.937.134 1.42zm.71-.336a6.69 6.69 0 01.904 2.076c.387 1.611-.06 3.256-.987 4.645-.927 1.39-2.313 2.49-3.746 2.998a6.57 6.57 0 01-.46.142c.87-.405 1.58-.94 1.973-1.585 1.038-1.697 2.362-4.88 2.326-7.95 0-.109-.008-.217-.013-.326h.003zm-6.798 3.835a.689.689 0 00.451-.326c.093-.144.155-.328.2-.526a.365.365 0 00-.277-.432.365.365 0 00-.431.277 1.032 1.032 0 01-.088.266 1.152 1.152 0 01-.222-.223c-.403-.503-.932-1.608-1.485-3.302-.124-.382-.124-.648-.072-.823a.563.563 0 01.305-.36c.34-.17.958-.16 1.69.132 1.444.579 3.006 2.12 3.006 4.385 0 1.185-.211 2.347-.909 3.036-.666.658-1.9.996-4.25.23a6.52 6.52 0 01-.66-.258 13.886 13.886 0 01-.29-2.549c-.051-1.82.088-3.318.364-4.55-.03.298.016.626.132.98.555 1.703 1.118 2.917 1.609 3.529.124.155.258.289.4.382a.717.717 0 00.53.124l-.003.008zm.028-8.676a9.26 9.26 0 00-.924-.062c.204-.224.418-.418.635-.588a4.776 4.776 0 011.19-.68c1.931.548 3.189 1.46 3.979 2.551.263.365.47.752.64 1.157-1.56-1.29-3.54-2.145-5.52-2.378zM2.499 5.545a6.168 6.168 0 011.41-1.342 6.453 6.453 0 012.577-1.028C5.562 4.827 5 7.23 5.099 10.637c.021.756.088 1.446.191 2.078-2.372-1.551-3.266-4.534-2.79-7.17zm-.792 9.272C.91 13.678.504 12.05.842 9.78a10.456 10.456 0 002.75 6.65c-.747-.384-1.397-.913-1.885-1.613zm3.676 2.241l-.062-.015c-2.553-1.986-4.265-5.389-3.63-9.352.215 2.398 1.438 4.758 3.798 5.974.395 1.558 1.064 2.663 1.921 3.373.083.07.168.134.256.196a9.246 9.246 0 01-2.28-.176h-.003zM13.375.996h.007L13.39 1c1.178.351 3.114 1.838 4.245 4.206 1.118 2.342 1.44 5.536-.581 9.31-1.412 2.634-3.4 3.948-5.461 4.292-1.63.27-3.33-.06-4.864-.86.743.036 1.487-.005 2.194-.119 1.01.284 2.105.189 3.145-.183 1.59-.566 3.101-1.769 4.108-3.28 1.007-1.51 1.531-3.36 1.087-5.215-.297-1.24-.93-2.365-1.779-3.33a6.82 6.82 0 00-1.13-2.624c-.731-1.01-1.795-1.854-3.272-2.45a5.298 5.298 0 012.293.243v.005zM43.315.02h-.893v12.257h.893V.021zm19.704 6.61a4.888 4.888 0 001.446-.364c.428-.19.79-.43 1.092-.717.307-.295.54-.636.702-1.023.163-.387.243-.813.243-1.283 0-1.056-.349-1.857-1.048-2.399-.7-.547-1.756-.823-3.171-.823h-3.127v12.256h.883V6.734h1.604c.237 0 .41.026.519.077a.853.853 0 01.32.269l3.924 4.973c.065.08.127.139.191.172a.55.55 0 00.243.052h.772l-4.219-5.3a1.378 1.378 0 00-.372-.347h-.002zm-.85-.555h-2.13V.723h2.244c1.092 0 1.924.212 2.494.632.57.421.857 1.07.857 1.942 0 .429-.077.81-.235 1.152-.154.34-.384.632-.684.875a3.12 3.12 0 01-1.092.563 5.129 5.129 0 01-1.456.19l.002-.002zm-28.849.037a.92.92 0 00-.32-.166c.103-.041.196-.093.276-.155a2.1 2.1 0 00.294-.268l5.353-5.5h-.718a.671.671 0 00-.294.06.87.87 0 00-.251.19l-4.947 5.085a1.29 1.29 0 01-.18.154.901.901 0 01-.192.104 1.029 1.029 0 01-.217.051 3.95 3.95 0 01-.286.008h-.728V0h-.883v12.275h.883V6.367h.787c.14 0 .253.008.346.026.093.01.17.033.235.07.07.028.13.067.18.113.052.047.112.1.174.165l5.19 5.301c.07.07.136.127.198.173.065.042.17.06.32.06h.718l-5.647-5.89a1.604 1.604 0 00-.294-.276l.003.003zm14.649 6.165h7.345v-.736h-6.452v-5.11h5.37v-.72h-5.37V.756h6.452V.021H47.97v12.256zm64.059-5.889a1.603 1.603 0 00-.294-.276.924.924 0 00-.32-.166c.103-.041.196-.093.276-.155.085-.064.186-.152.294-.268l5.353-5.5h-.718a.67.67 0 00-.294.06.865.865 0 00-.251.19l-4.947 5.085a1.309 1.309 0 01-.181.154.875.875 0 01-.191.104 1.021 1.021 0 01-.217.051 4.52 4.52 0 01-.286.008h-.728V0h-.883v12.275h.883V6.367h.787c.14 0 .256.008.346.026a.61.61 0 01.235.07c.07.028.129.067.181.113.051.047.111.1.173.165l5.19 5.301c.069.07.136.127.198.173.065.042.171.06.321.06h.717l-5.649-5.89.005.003zm-33.47 1.213a4.89 4.89 0 01-.26 1.604 3.7 3.7 0 01-.737 1.28c-.322.364-.718.65-1.187.857a3.916 3.916 0 01-1.578.305c-.589 0-1.118-.103-1.585-.312a3.416 3.416 0 01-1.178-.858 3.894 3.894 0 01-.736-1.28 4.967 4.967 0 01-.25-1.603V.023h-.89v7.58c0 .676.105 1.309.32 1.898.214.583.518 1.094.919 1.533.405.434.893.775 1.464 1.023.578.248 1.223.372 1.941.372s1.36-.124 1.931-.372a4.2 4.2 0 001.465-1.023c.402-.439.712-.95.926-1.533.215-.59.32-1.222.32-1.898V.024h-.882v7.58l-.003-.003zm18.895 4.676h7.346v-.736h-6.453v-5.11h5.371v-.72h-5.37V.756h6.452V.021h-7.346v12.256zm-5.108-1.972c0 .162.007.327.025.503L84.436.188c-.052-.07-.1-.113-.147-.129a.437.437 0 00-.191-.033h-.434v12.256h.772V1.965c0-.158-.008-.32-.026-.493l7.97 10.637c.08.117.19.173.32.173h.424V.026h-.78v10.281-.002zM57.048 31.092a.482.482 0 00.478-.478c0-.085.39-.996.865-1.732.13-.173.044-.434-.13-.607a.547.547 0 00-.647.173c-.261.39-.997 1.689-.997 2.166 0 .261.217.478.434.478h-.003zm62.011 0a.48.48 0 00.477-.478c0-.085.39-.996.865-1.732.129-.173.044-.434-.129-.607a.55.55 0 00-.65.173c-.261.39-.997 1.689-.997 2.166 0 .261.217.478.434.478zm16.097 3.207a.454.454 0 00-.606.173c-2.513 3.725-4.896 5.933-6.324 5.933h-.087c-.434-.085-.909-.346-1.214-.953-.39-.563-.519-1.125-.692-1.776.865-.346 1.862-1.299 2.079-2.902.173-1.082-.086-2.035-.78-2.383-.434-.217-.865-.13-1.255.26-.356.382-.653 1.054-.837 1.86a58.75 58.75 0 01-2.703 3.642c-2.641 3.336-3.465 3.465-3.594 3.465-.39-.043-.692-.691-.78-1.949-.044-1.255.088-2.814.173-4.288 0-.39.044-.824.044-1.214v-.01c.129-.12.258-.233.387-.339.217-.087.261-.39.088-.606-.129-.173-.39-.217-.607-.088-1.04.78-2.078 2.078-3.075 3.248-.346.434-.65.824-.996 1.255-.346.346-.651.736-.953 1.04-.692.607-1.214.953-1.645.865-.823-.087-.865-1.82-.952-3.248-.173-1.861-.434-3.81-1.777-3.855-.953 0-1.732 1.038-2.468 3.032-.261.606-.434 1.213-.607 1.905 0-1.645-.173-3.377-.607-4.635-.129-.26-.39-.346-.65-.26-.217.129-.302.304-.261.563.268.614.418 1.396.496 2.23-.215.344-.468.765-.723 1.103a23.848 23.848 0 01-1.126 2.037c-.434.607-.865 1.255-1.299 1.82-.865 1.082-1.776 1.645-2.641 1.472-1.214-.346-1.604-2.252-1.604-4.678 0-1.645.173-3.465.39-5.198.044-.217-.129-.434-.346-.478-.26-.044-.477.088-.519.346-.129.475-.216 1.04-.302 1.56-.519 3.119-1.43 7.58-2.685 8.36-.13.173-.26.173-.39.13-.434-.13-.692-.997-.692-2.296 0-.865.13-1.993.434-3.204.607-2.427 1.386-3.465 1.647-3.336.302.044.173.65.173.65-.044.261.088.478.346.52.217.087.475-.086.52-.347.128-.475.128-1.515-.825-1.732-.4-.108-1.383.028-2.277 2.417-1.838 1.433-3.878 3.695-5.838 6.419v-3.465c0-2.947-.085-4.506-.562-4.981-.173-.13-.302-.217-.475-.217-.563.088-.953 1.04-1.56 3.204-.607 2.079-1.386 4.764-2.34 5.198a.461.461 0 01-.474 0c-.346-.13-.563-.953-.563-2.123 0-.823.088-1.861.346-2.99.65-2.729 1.56-4.115 2.037-4.115.563 0 .519.607.519 1.125 0 .261.217.478.478.478.26 0 .475-.217.433-.477-.129-1.777-.78-2.035-1.43-2.035-.65 0-1.255.607-1.82 1.56-.39.908-.824 2.037-1.082 3.248-.217 1.04-.434 2.21-.434 3.248 0 1.386.346 2.512 1.17 2.858.39.173.823.173 1.255 0 .65-.302 1.17-1.17 1.603-2.21.475-1.04.824-2.34 1.17-3.55.216-.78.475-1.69.692-2.21.085.433.085 1.213.172 2.21v4.678c0 .563-.087 1.214-.087 1.862a66.924 66.924 0 00-3.984 6.886c-3.292 6.54-4.896 12.432-4.374 15.809.26 1.56.996 2.6 2.21 2.99.302.044.607.173.909.173.563 0 1.082-.217 1.603-.563 4.245-3.031 4.547-18.582 4.547-23.13 0-.65 0-1.254.044-1.905 1.72-2.576 3.584-4.828 5.355-6.41l-.013.043c-.26 1.082-.39 2.34-.39 3.421 0 1.56.346 2.903 1.343 3.163h.302c.302 0 .563-.044.824-.217.952-.606 1.644-2.339 2.078-4.33.173 2.642.868 4.072 2.252 4.506 1.254.302 2.383-.478 3.379-1.603.519-.563.997-1.255 1.472-1.994.434-.736.865-1.386 1.214-2.122l.01-.016v.016c.088 1.386 0 2.773-.085 3.638v.434c0 .26 0 .606.433.65h.044c.302 0 .39-.26.519-.563.044-.216.088-.475.217-.78.261-1.081.651-2.901 1.299-4.46.865-2.34 1.43-2.47 1.559-2.47.78.089.78 1.645.909 3.076 0 .477.129.953.129 1.342.044.475.129.91.302 1.255.217.78.607 1.343 1.387 1.472.692.088 1.43-.39 2.122-.997.39-.302.736-.736 1.041-1.125.953-1.04 1.732-2.079 2.6-3.075.059-.065.116-.124.175-.186v.317a28.914 28.914 0 00-.173 3.248c0 .563 0 1.04.044 1.516.129 1.299.519 2.251 1.516 2.34h.088c1.5 0 4.505-3.923 6.096-6.182v.03c0 1.214.261 2.513.909 3.595.433.824 1.169 1.299 1.993 1.299h.088c2.641.044 5.848-4.418 7.103-6.28a.552.552 0 00-.173-.65l-.011.013zM86.241 44.304c0 9.442-1.126 20.27-4.157 22.393-.519.39-1.082.478-1.688.26-.824-.26-1.43-.996-1.604-2.294-.736-4.418 2.858-13.558 7.45-20.834v.475zm40.687-11.046c.087-.088.129-.088.129-.088h.044c.216.088.433.651.346 1.43-.13.866-.607 1.777-1.299 2.167-.129-1.56.302-2.99.78-3.509zM39.53 16.8c-2.815-.735-6.324 4.29-8.49 11.305.044-1.214.088-2.34.088-3.292 0-2.296-.173-3.855-.824-4.506-.217-.173-.475-.302-.78-.302-.217 0-.39.26-.346.478 0 .26.217.477.478.433l.044.044c.39.39.563 1.862.563 3.9 0 2.165-.173 4.98-.346 7.753-.868 3.248-2.167 6.757-2.946 9.398-.088.217.173.39.39.478.26 0 .474-.173.474-.434.088-.736 1.43-4.462 1.862-6.15-.217 2.946-.65 8.445-.692 10.093-.088-.088-.26-.13-.302-.217-.26-.085-.519-.044-.607.129-.173.26-.129.519.088.607.26.172.52.302.824.477-.044.434-.044.736-.044.953.044.26.217.434.475.39.26 0 .39-.217.39-.39v-.692c.39.085.736.173 1.04.173.651 0 1.214-.173 1.777-.39 1.82-.736 3.594-2.556 5.153-5.197 1.387-2.34 2.6-5.327 3.377-8.446.824-3.292 1.214-6.411 1.214-9.052 0-4.116-.953-7.06-2.858-7.537l-.003-.005zm.779 16.33c-1.43 5.542-4.374 11.693-7.97 13.08a4.246 4.246 0 01-2.425.172c.044-2.339.302-6.584.692-11.52.085-.692.13-1.43.173-2.123.173-.607.302-1.255.434-1.861 1.993-7.97 5.76-13.817 8.1-13.254 1.386.346 2.166 2.902 2.166 6.54 0 2.557-.346 5.676-1.17 8.965zm37.939 1.817c-.044.173.129.434.39.519.26.044.477-.088.519-.346.088-.39.129-.953.129-1.472 0-.692-.088-1.299-.52-1.689-.345-.39-.908-.475-1.603-.302-1.603.434-2.902 3.726-3.42 5.286 0-1.733-.174-2.946-.693-3.51-.173-.301-.519-.474-.823-.518-.261 0-.475.129-.475.39-.044.26.173.475.434.519.043 0 .085 0 .216.129.07.095.142.237.21.436a.463.463 0 00-.068.085c-2.512 3.726-4.895 5.934-6.323 5.934h-.088c-.433-.086-.908-.346-1.213-.953-.39-.563-.52-1.126-.692-1.776.865-.346 1.861-1.3 2.078-2.903.173-1.082-.087-2.034-.78-2.383-.433-.217-.864-.129-1.254.261-.357.382-.654 1.053-.837 1.859a59.113 59.113 0 01-2.703 3.643c-2.642 3.336-3.465 3.465-3.594 3.465-.39-.044-.692-.692-.78-1.95-.044-1.254.088-2.814.173-4.288 0-.39.044-.824.044-1.213 0-.261-.13-.476-.39-.476-.217 0-.434.13-.475.39-.044.434-.044.868-.044 1.3-.06.523-.1 1.047-.129 1.559-1.96-.055-5.311 1.33-9.897 4.115 4.028-5.241 6.238-8.445 5.242-9.442-.302-.302-.78-.217-1.255.044-.26.088-.52.26-.78.478-.302.217-.607.475-.997.736-.562.39-1.298.908-1.905 1.342-.692.39-1.255.736-1.776.78-.261 0-.39.26-.39.475.044.26.26.39.519.39 1.213-.13 2.729-1.299 4.072-2.296.65-.433 1.559-1.17 1.905-1.298 0 .217-.173.996-1.905 3.594-1.387 2.034-3.12 4.288-4.418 5.89l-.52.65c-.128.217-.128.434 0 .607.13.087.218.129.347.129.087 0 .173-.044.26-.044 3.848-2.479 8.875-5.296 11.462-5.242-.005.269-.01.53-.01.783 0 .563 0 1.04.043 1.515.13 1.3.52 2.252 1.516 2.34h.088c1.5 0 4.505-3.922 6.096-6.181v.03c0 1.214.26 2.513.909 3.594.433.824 1.17 1.3 1.993 1.3h.088c2.352.038 5.148-3.492 6.62-5.58.023.286.039.612.039.989 0 1.298-.173 3.119-.52 5.848v.088c-.087.26.13.475.39.475.217 0 .434-.173.434-.303.997-5.414 2.902-9.876 4.201-10.265.434-.044.607 0 .78.129.302.302.434 1.081.085 2.339l-.005-.005zM64.92 33.258c.088-.088.129-.088.129-.088h.044c.217.088.434.651.346 1.43-.13.866-.607 1.777-1.299 2.167-.129-1.56.302-2.99.78-3.509z'
    ></path>
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
