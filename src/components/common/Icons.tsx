import { SVGProps } from "react";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "color"> {
  color?: string;
}

const WishIcon = ({ color = "white", ...rest }: IconProps) => {
  return (
    <svg
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      {...rest}
    >
      <path
        d="M5.49902 -0.00927734C2.46142 -0.00927734 -0.000976562 2.45273 -0.000976562 5.49073C-0.000976562 8.67474 1.81252 11.6787 4.81152 14.4287C5.83512 15.3667 6.93723 16.1897 8.03023 16.9287C8.41333 17.1867 8.77163 17.4208 9.09282 17.6158C9.28863 17.7348 9.41773 17.8208 9.49903 17.8658C9.80103 18.0338 10.197 18.0338 10.499 17.8658C10.5803 17.8208 10.7094 17.7348 10.9052 17.6158C11.2264 17.4208 11.5847 17.1867 11.9678 16.9287C13.0608 16.1897 14.1629 15.3667 15.1865 14.4287C18.1855 11.6787 19.999 8.67474 19.999 5.49073C19.999 2.45273 17.5366 -0.00927734 14.499 -0.00927734C12.7738 -0.00927734 11.0894 0.930736 10.0302 2.30274C8.99743 0.906736 7.31893 -0.00927734 5.49902 -0.00927734Z"
        fill={color}
      />
    </svg>
  );
};

const HomeIcon = ({ color = "white", ...rest }: IconProps) => {
  return (
    <svg
      width="21"
      height="22"
      viewBox="0 0 21 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      {...rest}
    >
      <path
        d="M1.16675 9.93841C1.16675 8.71422 1.72733 7.55744 2.68817 6.79888L8.18817 2.45677C9.64141 1.30948 11.6921 1.30948 13.1453 2.45677L18.6453 6.79888C19.6062 7.55744 20.1667 8.71422 20.1667 9.93841V16.5C20.1667 18.7091 18.3759 20.5 16.1667 20.5H14.6667C14.1145 20.5 13.6667 20.0523 13.6667 19.5V16.5C13.6667 15.3954 12.7713 14.5 11.6667 14.5H9.66675C8.56218 14.5 7.66675 15.3954 7.66675 16.5V19.5C7.66675 20.0523 7.21903 20.5 6.66675 20.5H5.16675C2.95761 20.5 1.16675 18.7091 1.16675 16.5L1.16675 9.93841Z"
        fill={color ?? "white"}
        stroke={color ?? "white"}
        strokeWidth="1.5"
      />
    </svg>
  );
};

const MyIcon = ({ color = "white", ...rest }: IconProps) => {
  return (
    <svg
      width="17"
      height="19"
      viewBox="0 0 17 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      {...rest}
    >
      <circle
        cx="4"
        cy="4"
        r="4"
        transform="matrix(-1 0 0 1 12.3335 1)"
        fill={color ?? "white"}
        stroke={color ?? "white"}
        strokeWidth="1.5"
      />
      <path
        d="M1.3335 14.9347C1.3335 14.0743 1.87435 13.3068 2.68459 13.0175C6.33754 11.7128 10.3295 11.7128 13.9824 13.0175C14.7926 13.3068 15.3335 14.0743 15.3335 14.9347V16.2502C15.3335 17.4376 14.2818 18.3498 13.1063 18.1818L12.1519 18.0455C9.61914 17.6837 7.04785 17.6837 4.51512 18.0455L3.5607 18.1818C2.3852 18.3498 1.3335 17.4376 1.3335 16.2502V14.9347Z"
        fill={color ?? "white"}
        stroke={color ?? "white"}
        strokeWidth="1.5"
      />
    </svg>
  );
};

const LocationIcon = ({ color = "white", ...rest }: IconProps) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      {...rest}
    >
      <path
        d="M11.9833 13.1374C11.9833 11.8132 13.0927 10.7398 14.4612 10.7398C15.8297 10.7398 16.939 11.8132 16.939 13.1374C16.939 14.4616 15.8297 15.535 14.4612 15.535C13.0927 15.535 11.9833 14.4616 11.9833 13.1374Z"
        fill={color ?? "white"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.18916 12.3092C8.45116 9.23367 11.1073 6.8667 14.2965 6.8667H14.6259C17.8151 6.8667 20.4712 9.23367 20.7332 12.3092C20.8743 13.9651 20.3457 15.6094 19.2587 16.8957L15.6044 21.2201C15.0135 21.9193 13.9088 21.9193 13.318 21.2201L9.66367 16.8957C8.57672 15.6094 8.0481 13.9651 8.18916 12.3092ZM14.4612 9.63319C12.4611 9.63319 10.8397 11.2021 10.8397 13.1374C10.8397 15.0727 12.4611 16.6416 14.4612 16.6416C16.4613 16.6416 18.0827 15.0727 18.0827 13.1374C18.0827 11.2021 16.4613 9.63319 14.4612 9.63319Z"
        fill={color ?? "white"}
      />
    </svg>
  );
};

const CaretDownIcon = ({ color = "white", ...rest }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="29"
      height="28"
      viewBox="0 0 29 28"
      fill="none"
      preserveAspectRatio="none"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.718 10.2653C20.0532 10.6005 20.0532 11.144 19.718 11.4792L15.1402 16.057C14.805 16.3922 14.2615 16.3922 13.9263 16.057L9.34857 11.4792C9.01337 11.144 9.01337 10.6005 9.34857 10.2653C9.68377 9.93012 10.2272 9.93012 10.5624 10.2653L14.5333 14.2362L18.5041 10.2653C18.8393 9.93012 19.3828 9.93012 19.718 10.2653Z"
        fill={color ?? "white"}
      />
    </svg>
  );
};

const ArrowRightIcon = ({ color = "white", ...rest }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="18"
      viewBox="0 0 9 18"
      fill="none"
      preserveAspectRatio="none"
      {...rest}
    >
      <path
        d="M1.30008 17.011L7.40067 9.89363C7.8415 9.37933 7.8415 8.62042 7.40067 8.10612L1.30008 0.988765"
        stroke={color ?? "white"}
        strokeWidth="1.71667"
        strokeLinecap="round"
      />
    </svg>
  );
};

const GirlCrushIcon = ({ color = "white", ...rest }: IconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M15 4C15 5.66 13.66 7 12 7C10.34 7 9 5.66 9 4C9 2.34 10.34 1 12 1C13.66 1 15 2.34 15 4Z"
        fill={color}
      />
      <path
        d="M12 14C8.13 14 5 17.13 5 21H19C19 17.13 15.87 14 12 14Z"
        fill={color}
      />
    </svg>
  );
};

const HeartIcon = ({ color = "white", ...rest }: IconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
        fill={color}
      />
    </svg>
  );
};

const HighHeelIcon = ({ color = "white", ...rest }: IconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M4 18H5.5V20.5C5.5 21.05 5.95 21.5 6.5 21.5H7.5C8.05 21.5 8.5 21.05 8.5 20.5V18H10L12 15L14 18H15.5V20.5C15.5 21.05 15.95 21.5 16.5 21.5H17.5C18.05 21.5 18.5 21.05 18.5 20.5V18H20L18 15L16 12L14 9L12 6L10 9L8 12L6 15L4 18Z"
        fill={color}
      />
    </svg>
  );
};

const MoonIcon = ({ color = "white", ...rest }: IconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z"
        fill={color}
      />
      <path
        d="M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7Z"
        fill={color}
      />
    </svg>
  );
};

export {
  WishIcon,
  HomeIcon,
  MyIcon,
  LocationIcon,
  CaretDownIcon,
  ArrowRightIcon,
  GirlCrushIcon,
  HeartIcon,
  HighHeelIcon,
  MoonIcon,
};
