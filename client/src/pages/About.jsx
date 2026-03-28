import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="relative z-10 overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20 xl:pt-40 xl:pb-28">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full px-4 lg:w-1/2">
            <div className="mb-12 lg:mb-0 max-w-[500px]">
              <h2 className="mb-6 text-4xl font-bold leading-tight text-base-content sm:text-5xl">
                About <span className="text-primary">MailCraft</span>
              </h2>
              <p className="mb-6 text-base font-medium leading-relaxed text-base-content/70 sm:text-lg">
                MailCraft is a cutting-edge email marketing platform designed to
                supercharge your communication strategies. Our mission is to
                simplify the complexities of bulk emailing while maximizing
                engagement and delivery rates.
              </p>
              <p className="text-base font-medium leading-relaxed text-base-content/70 sm:text-lg">
                Whether you are a small business owner looking to reach new
                customers or a large enterprise managing specialized campaigns,
                MailCraft provides the tools you need.
              </p>
              <div className="mt-8">
                <Link
                  to="/"
                  className="btn btn-primary px-8 text-base font-semibold text-white shadow-lg hover:shadow-primary/50"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          
          <div className="w-full px-4 lg:w-1/2">
            <div className="flex flex-wrap -mx-2 sm:-mx-4">
              <div className="w-1/2 px-2 sm:px-4">
                <div className="py-8 px-6 mb-4 sm:mb-8 bg-base-200 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <span className="block text-4xl mb-4">🚀</span>
                  <h3 className="text-lg font-bold text-base-content mb-2">Automated campaigns</h3>
                  <p className="text-sm text-base-content/60">Streamline your workflow</p>
                </div>
                <div className="py-8 px-6 bg-base-200 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <span className="block text-4xl mb-4">🎨</span>
                  <h3 className="text-lg font-bold text-base-content mb-2">HTML Templates</h3>
                  <p className="text-sm text-base-content/60">Beautiful designs supported</p>
                </div>
              </div>
              
              <div className="w-1/2 px-2 sm:px-4 mt-8 sm:mt-12">
                <div className="py-8 px-6 mb-4 sm:mb-8 bg-base-200 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <span className="block text-4xl mb-4">📊</span>
                  <h3 className="text-lg font-bold text-base-content mb-2">Real-time Analytics</h3>
                  <p className="text-sm text-base-content/60">Insights coming soon</p>
                </div>
                <div className="py-8 px-6 bg-base-200 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <span className="block text-4xl mb-4">🔒</span>
                  <h3 className="text-lg font-bold text-base-content mb-2">Secure</h3>
                  <p className="text-sm text-base-content/60">Scalable infrastructure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
