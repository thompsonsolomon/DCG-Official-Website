import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  path?: string;
};

type PageHeaderProps = {
  title: string;
  backgroundImage: string;
  breadcrumbs?: BreadcrumbItem[];
};

const Breadcrumb = ({
  title,
  backgroundImage,
  breadcrumbs = [],
}: PageHeaderProps) => {
  return (
    <section
      className="relative w-full h-[28vh] sm:h-[32vh] lg:h-[38vh] flex items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />

      {/* CONTENT */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        
        {/* TITLE */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {title}
        </h1>

        {/* BREADCRUMB */}
        {breadcrumbs.length > 0 && (
          <nav className="flex justify-center">
            <ol className="flex items-center flex-wrap gap-2 text-sm text-gray-200">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <li key={index} className="flex items-center gap-2">
                    {item.path && !isLast ? (
                      <Link
                        to={item.path}
                        className="hover:text-white transition duration-200"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-white font-medium">
                        {item.label}
                      </span>
                    )}

                    {!isLast && (
                      <ChevronRight size={16} className="text-gray-300" />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
      </div>

      {/* OPTIONAL BOTTOM GRADIENT (nice fade effect) */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/10 to-transparent" />
    </section>
  );
};

export default Breadcrumb;