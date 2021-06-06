import * as React from "react";
import { useGithubJsonForm, useGithubToolbarPlugins } from 'react-tinacms-github'
import { getGithubPreviewProps, parseJson } from 'next-tinacms-github'
import { GetStaticProps } from 'next'
import { useCMS, withTina, useForm, usePlugin } from "tinacms";
import { InlineForm, InlineBlocks } from "react-tinacms-inline";
import { HeroBlock, hero_template } from "../components/hero";
import {
  TestimonialBlock,
  testimonial_template,
} from "../components/testimonial";
import { Nav } from "../components/nav";
import { Footer } from "../components/footer";
import { FeaturesBlock, features_template } from "../components/features";
import { TinaModal } from "../components/modal";
import { Theme } from "../components/theme";
// import HomeData from "../data/home.json";

const App = ({ file }) => {
  const cms = useCMS();
  cms.plugins.remove({
    __type: "screen",
    name: "Media Manager",
  });

  const [showModal, setShowModal] = React.useState(false);

  // const [data, form] = useForm({
  //   initialValues: HomeData,
  //   fields: [],
  //   onSubmit: (values) => {
  //     setShowModal(true);
  //   },
  // });
  const [data, form] = useGithubJsonForm(file)
  usePlugin(form);
  useGithubToolbarPlugins()

  return (
    <div className="App">
      <InlineForm form={form}>
        <Theme>
          <Nav data={data.nav} />
          <InlineBlocks name="blocks" blocks={PAGE_BLOCKS} />
          <Footer name={data.nav.wordmark.name} data={data.footer} />
        </Theme>
      </InlineForm>
      {showModal && (
        <TinaModal
          data={data}
          close={() => {
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

const PAGE_BLOCKS = {
  hero: {
    Component: HeroBlock,
    template: hero_template,
  },
  testimonial: {
    Component: TestimonialBlock,
    template: testimonial_template,
  },
  features: {
    Component: FeaturesBlock,
    template: features_template,
  },
};

const tinaOptions = { enabled: true, sidebar: false, toolbar: true };

export default withTina(App, tinaOptions);

export const getStaticProps: GetStaticProps = async function(props: any) {
 
  const preview: boolean = props.preview;
  const previewData: any = props.previewData;

  if (preview) {
     return getGithubPreviewProps({
       ...previewData,
       fileRelativePath: 'data/home.json',
       parse: parseJson,
     })
   }
   return {
     props: {
       sourceProvider: null,
       error: null,
       preview: false,
       file: {
         fileRelativePath: 'data/home.json',
         data: (await import('../data/home.json')).default,
       },
     },
   }
  }