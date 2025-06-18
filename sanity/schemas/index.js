// Single Types
import Affiliate_Page from './singleTypes/Affiliate_Page';
import Contact_Page from './singleTypes/Contact_Page';
import Cooperation_Page from './singleTypes/Cooperation_Page';
import Crocheting_Page from './singleTypes/CrochetingCourses_Page';
import CrochetingProducts_Page from './singleTypes/CrochetingProducts_Page';
import global, { global_OrganizationSchema, global_Seo, nav_Link, nav_Links } from './singleTypes/global';
import homepage from './singleTypes/homepage';
import Knitting_Page from './singleTypes/KnittingCourses_Page';
import KnittingProducts_Page from './singleTypes/KnittingProducts_Page';
import Newsletter_Page from './singleTypes/Newsletter_Page';
import Partners_Page from './singleTypes/Partners_Page';
// import WhyBrand_Page from './singleTypes/WhyBrand_Page';
import Blog_Page from './singleTypes/Blog_Page';
import Delete_Page from './singleTypes/dashboard/Delete_Page';
import Logout_Page from './singleTypes/dashboard/Logout_Page';
import NotFound_Page from './singleTypes/NotFound_Page';
import PrivacyPolicy_Page, { Privacy_Policy_Page_Content } from './singleTypes/PrivacyPolicy_Page';
import Statute_Page, { Statute_Page_Content } from './singleTypes/Statute_Page';

import Cart from './singleTypes/Cart';
import Authorization_Page from './singleTypes/dashboard/Authorization_Page';
import ChangePasswordSuccess_Page from './singleTypes/dashboard/ChangePasswordSuccess_Page';
import Courses_Page from './singleTypes/dashboard/Courses_Page';
import Data_Page from './singleTypes/dashboard/Data_Page';
import Files_Page from './singleTypes/dashboard/Files_Page';
import Orders_Page from './singleTypes/dashboard/Orders_Page';
import RegisterSuccess_Page from './singleTypes/dashboard/RegisterSuccess_Page';
import ResetPassword_Page from './singleTypes/dashboard/ResetPassword_Page';
import SetPassword_Page from './singleTypes/dashboard/SetPassword_Page';
// import AboutUs_Page from './singleTypes/AboutUs_Page';
import Instructions_Page from './singleTypes/Instructions_Page';
import MaterialsPackages_Page from './singleTypes/MaterialsPackages_Page';
import OtherProducts_Page from './singleTypes/OtherProducts_Page';
import OurBrands_Page from './singleTypes/OurBrands_Page';
import StanVouchera_Page from './singleTypes/StanVoucher_Page';
import Team_Page from './singleTypes/Team_Page';

export const singleTypes = [
  homepage,
  Knitting_Page,
  KnittingProducts_Page,
  Crocheting_Page,
  CrochetingProducts_Page,
  MaterialsPackages_Page,
  Instructions_Page,
  OtherProducts_Page,
  // AboutUs_Page,
  Team_Page,
  Contact_Page,
  Partners_Page,
  OurBrands_Page,
  Cooperation_Page,
  Affiliate_Page,
  Newsletter_Page,
  // WhyBrand_Page,
  NotFound_Page,
  PrivacyPolicy_Page,
  Statute_Page,
  Blog_Page,
  Cart,
  StanVouchera_Page,
];

// Collection Types
import Author_Collection from './collectionTypes/Author_Collection';
import BlogCategory_Collection from './collectionTypes/BlogCategory_Collection';
import BlogPost_Collection, { BlogPost_Collection_Hero } from './collectionTypes/BlogPost_Collection';
import bundle from './collectionTypes/Bundle_Collection';
import course from './collectionTypes/Course_Collection';
import CourseAuthor_Collection from './collectionTypes/CourseAuthor_Collection';
import CourseCategories from './collectionTypes/CourseCategories';
import CustomerCaseStudy_Collection from './collectionTypes/CustomerCaseStudy_Collection';
import FaqCollection from './collectionTypes/FaqCollection';
import landingPage from './collectionTypes/landingPage';
import lesson from './collectionTypes/Lesson_Collection';
import Partner_Collection from './collectionTypes/Partner_Collection';
import product from './collectionTypes/Product_Collection';
import productCategory from './collectionTypes/ProductCategories';
import ReviewCollection from './collectionTypes/ReviewCollection';
import CourseReviews_Collection from './collectionTypes/Reviews_Collection';

export const collectionTypes = [
  landingPage,
  thankYouPage,
  product,
  lesson,
  course,
  ReviewCollection,
  FaqCollection,
  productCategory,
  CourseCategories,
  CustomerCaseStudy_Collection,
  Partner_Collection,
  BlogCategory_Collection,
  Author_Collection,
  BlogPost_Collection,
  CourseReviews_Collection,
  CourseAuthor_Collection,
  bundle,
  voucher,
];

// Components
import Content from '../components/Content';
import PortableText from '../components/PortableText';
import thankYouPage from './collectionTypes/thankYouPage';
import voucher from './collectionTypes/Voucher_Collection';
import Benefits from './components/Benefits';
import ArticleGreetings from './components/BlogPosts/ArticleGreetings';
import BadgeSection from './components/BlogPosts/BadgeSection';
import ColorPicker, { ColorPicker_List } from './components/BlogPosts/ColorPicker';
import ConversationShowcase, {
  ConversationShowcase_List,
  ConversationShowcase_Recipient,
  ConversationShowcase_Sender,
} from './components/BlogPosts/ConversationShowcase';
import HighlightedImage from './components/BlogPosts/HighlightedImage';
import ImageBadge from './components/BlogPosts/ImageBadge';
import ImagesGrid, { ImagesGrid_List } from './components/BlogPosts/ImagesGrid';
import ProcessComponent, { ProcessComponent_List } from './components/BlogPosts/ProcessComponent';
import ProcessShowcase, { ProcessShowcase_List, ProcessShowcase_Process } from './components/BlogPosts/ProcessShowcase';
import QuoteSection from './components/BlogPosts/QuoteSection';
import Standout from './components/BlogPosts/Standout';
import TableSection, { TableSection_Table } from './components/BlogPosts/TableSection';
import VideoSection from './components/BlogPosts/VideoSection';
import Bonuses from './components/Bonuses';
import ChapterList from './components/ChaptersList';
import Community from './components/Community';
import CompaniesShowcase, { CompaniesShowcase_Item } from './components/CompaniesShowcase';
import ContactForm from './components/ContactForm';
import CourseModules from './components/CourseModules';
import cta from './components/cta';
import CtaSection from './components/CtaSection';
import CustomerCaseStudy from './components/CustomerCaseStudy';
import Divider from './components/Divider';
import Faq from './components/Faq';
import ImageAndText from './components/FlexImageAndText';
import HeroBackgroundImg from './components/HeroBackgroundImg';
import HeroColumn from './components/HeroColumn';
import HeroSimple from './components/HeroSimple';
import ImageShowcase from './components/ImageShowcase';
import Introduction from './components/Introduction';
import LatestBlogEntries from './components/LatestBlogEntries';
import LogoSection from './components/LogoSection';
import MostPopularCourses from './components/MostPopularCourses';
import Newsletter from './components/Newsletter';
import Opinions, { Opinions_List } from './components/Opinions';
import Partners from './components/Partners';
import productParameters from './components/productParameters';
import productVariant from './components/productVariant';
import Reviews from './components/Reviews';
import seo from './components/seo';
import SimpleCtaSection from './components/SimpleCtaSection';
import StepsList, { StepList_Item } from './components/StepList';
import StepsGrid, { StepsGrid_Item } from './components/StepsGrid';
import TabSection, { TabSection_Item } from './components/TabSection';
import TeamShowcase, { TeamShowcase_Item } from './components/TeamShowcase';
import TileList from './components/TileList';
import TilesFeatures, { TilesFeatures_Item } from './components/TilesFeatures';
import TilesGallery, { TilesGallery_Item } from './components/TilesGallery';
import TilesGrid, { TilesGrid_Item } from './components/TilesGrid';
import TilesIcon, { TilesIcon_Item } from './components/TilesIcon';
import TilesIndicated, { TilesIndicated_Item } from './components/TilesIndicated';
import TilesSticky, { TilesSticky_Item } from './components/TilesSticky';
import titleAndDescription from './components/titleAndDescription';
import WordsCollection from './components/WordsCollection';
import AffiliateDashboard_Page, {
  AffiliateDashboardPage_AffiliateCode,
  AffiliateDashboardPage_TextSection,
} from './singleTypes/dashboard/AffiliateDashboard_Page';
import Support_Page, { Support_Page_Tabs } from './singleTypes/dashboard/Support_Page';
import DiscountHero from './components/DiscountCourse/DiscountHero';
import TimerBox from './components/DiscountCourse/TimerBox';
import ImageHeading from './components/DiscountCourse/ImageHeading';
import CtaHeading from './components/DiscountCourse/CtaHeading';
import DiscountCta from './components/DiscountCourse/DiscountCta';
export const schemaTypes = [
  ...singleTypes,
  ...collectionTypes,

  Delete_Page,
  Logout_Page,
  Support_Page,
  Support_Page_Tabs,
  AffiliateDashboard_Page,
  Authorization_Page,
  ChangePasswordSuccess_Page,
  Courses_Page,
  Data_Page,
  Files_Page,
  Orders_Page,
  RegisterSuccess_Page,
  ResetPassword_Page,
  SetPassword_Page,

  global,
  global_Seo,
  nav_Link,
  nav_Links,

  cta,
  seo,
  titleAndDescription,
  Opinions,
  Opinions_List,
  Faq,
  TileList,
  CtaSection,
  SimpleCtaSection,
  HeroBackgroundImg,
  Benefits,
  CourseModules,
  ImageShowcase,
  Bonuses,
  TilesGrid,
  TilesGallery,
  TilesGallery_Item,
  TilesGrid_Item,
  TilesSticky,
  TilesSticky_Item,
  TilesFeatures,
  TilesFeatures_Item,
  Community,
  Content,
  ChapterList,
  Reviews,
  Introduction,
  ContactForm,
  TabSection,
  TabSection_Item,
  TilesIndicated,
  TilesIndicated_Item,
  productVariant,
  productParameters,
  TilesIcon,
  TilesIcon_Item,
  Divider,
  StepsList,
  StepList_Item,
  HeroColumn,
  Newsletter,
  CustomerCaseStudy,
  WordsCollection,
  Partners,
  Statute_Page_Content,
  Privacy_Policy_Page_Content,
  ImageAndText,
  MostPopularCourses,
  global_OrganizationSchema,
  StepsGrid,
  StepsGrid_Item,
  HeroSimple,
  LatestBlogEntries,
  AffiliateDashboardPage_AffiliateCode,
  AffiliateDashboardPage_TextSection,
  PortableText,
  ProcessComponent,
  ProcessComponent_List,
  HighlightedImage,
  ArticleGreetings,
  Standout,
  ImageBadge,
  ImagesGrid,
  ImagesGrid_List,
  BadgeSection,
  TableSection,
  TableSection_Table,
  ProcessShowcase,
  ProcessShowcase_List,
  QuoteSection,
  VideoSection,
  ConversationShowcase_List,
  ConversationShowcase_Recipient,
  ConversationShowcase_Sender,
  ConversationShowcase,
  BlogPost_Collection_Hero,
  ProcessShowcase_Process,
  ColorPicker,
  ColorPicker_List,
  CompaniesShowcase_Item,
  CompaniesShowcase,
  TeamShowcase_Item,
  TeamShowcase,
  LogoSection,
  DiscountHero,
  TimerBox,
  ImageHeading,
  CtaHeading,
  DiscountCta,
];
