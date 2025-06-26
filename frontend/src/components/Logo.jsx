import todoListLogo from "../images/to-do-listpink.png";

export const Logo = ({
  logo = todoListLogo,
  text,
  altText = "Logo",
  textColor = "text-primary",
}) => {
  return (
    <div className="flex space-x-2 items-center">
      <img src={logo} alt={altText} className="logo-image w-7" />
      <span className={`logo-text font-serif font-bold text-2xl ${textColor}`}>
        {text}
      </span>
    </div>
  );
};
export default Logo;
