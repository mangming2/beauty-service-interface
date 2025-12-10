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
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      preserveAspectRatio="none"
      {...rest}
    >
      <path
        d="M11.1667 5.77778C11.1667 9.39632 6.9 13.1667 5.83333 13.1667C4.76667 13.1667 0.5 9.39632 0.5 5.77778C0.5 2.86294 2.88781 0.5 5.83333 0.5C8.77885 0.5 11.1667 2.86294 11.1667 5.77778Z"
        stroke={color ?? "#ABA9A9"}
      />
      <circle
        cx="2"
        cy="2"
        r="2"
        transform="matrix(-1 0 0 1 7.8335 3.5)"
        stroke={color ?? "#ABA9A9"}
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

const ArrowLeftIcon = ({ color = "white", ...rest }: IconProps) => {
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
        d="M7.69992 0.988765L1.59933 8.10612C1.1585 8.62042 1.1585 9.37933 1.59933 9.89363L7.69992 17.011"
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

const GlobalIcon = ({ color = "white", ...rest }: IconProps) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      {...rest}
    >
      <path
        d="M7 0C10.866 0 14 3.13401 14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7C0 3.13401 3.13401 0 7 0ZM5.21289 9.5C5.35297 10.2896 5.5542 10.9871 5.79785 11.5557C6.03754 12.1149 6.29769 12.5039 6.53516 12.7383C6.76816 12.9681 6.92398 13 7 13C7.07602 13 7.23184 12.9681 7.46484 12.7383C7.70231 12.5039 7.96246 12.1149 8.20215 11.5557C8.4458 10.9871 8.64703 10.2896 8.78711 9.5H5.21289ZM1.5459 9.5C2.26133 11.0583 3.6237 12.2563 5.29004 12.751C4.79884 11.9541 4.41425 10.8237 4.19727 9.5H1.5459ZM9.80273 9.5C9.58571 10.824 9.20031 11.9541 8.70898 12.751C10.3757 12.2564 11.7385 11.0585 12.4541 9.5H9.80273ZM1.18848 5.5C1.0651 5.97939 1 6.4821 1 7C1 7.5179 1.0651 8.02061 1.18848 8.5H4.06934C4.02412 8.01676 4 7.51488 4 7C4 6.48512 4.02412 5.98324 4.06934 5.5H1.18848ZM5.07617 5.5C5.02825 5.97808 5 6.48001 5 7C5 7.51999 5.02825 8.02192 5.07617 8.5H8.92383C8.97175 8.02192 9 7.51999 9 7C9 6.48001 8.97175 5.97808 8.92383 5.5H5.07617ZM9.93066 5.5C9.97588 5.98324 10 6.48512 10 7C10 7.51488 9.97588 8.01676 9.93066 8.5H12.8115C12.9349 8.02061 13 7.5179 13 7C13 6.4821 12.9349 5.97939 12.8115 5.5H9.93066ZM5.29004 1.24805C3.62358 1.74271 2.26137 2.94166 1.5459 4.5H4.19727C4.41431 3.17589 4.79863 2.04497 5.29004 1.24805ZM7 1C6.92398 1 6.76816 1.03186 6.53516 1.26172C6.29769 1.49608 6.03754 1.88507 5.79785 2.44434C5.5542 3.01289 5.35297 3.71039 5.21289 4.5H8.78711C8.64703 3.71039 8.4458 3.01289 8.20215 2.44434C7.96246 1.88507 7.70231 1.49608 7.46484 1.26172C7.23184 1.03186 7.07602 1 7 1ZM8.70898 1.24805C9.20052 2.04499 9.58565 3.17564 9.80273 4.5H12.4541C11.7385 2.94138 10.3759 1.74255 8.70898 1.24805Z"
        fill={color ?? "white"}
      />
    </svg>
  );
};

const SpinnerIcon = ({ color = "currentColor", ...rest }: IconProps) => {
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
        d="M12 2V6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 18V22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.93 4.93L7.76 7.76"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.24 16.24L19.07 19.07"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12H6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 12H22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.93 19.07L7.76 16.24"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.24 7.76L19.07 4.93"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const LoginIcon = ({ color = "currentColor", ...rest }: IconProps) => {
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
        d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 17L15 12L10 7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12H3"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const UserPlusIcon = ({ color = "currentColor", ...rest }: IconProps) => {
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
        d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 8V14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 11H23"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const XIcon = ({ color, ...rest }: IconProps) => {
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
        d="M21.3808 2.22122H25.3165L16.7181 12.0486L26.8334 25.4215H18.9132L12.7098 17.3109L5.61169 25.4215H1.67359L10.8704 14.91L1.16675 2.22122H9.28804L14.8954 9.63461L21.3808 2.22122ZM19.9994 23.0658H22.1803L8.10304 4.45321H5.76279L19.9994 23.0658Z"
        fill={color ?? "#F92595"}
      />
    </svg>
  );
};

const AppleIcon = ({ color, ...rest }: IconProps) => {
  return (
    <svg
      width="24"
      height="28"
      viewBox="0 0 24 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      {...rest}
    >
      <path
        d="M23.4239 21.8208C23.0004 22.7991 22.4992 23.6995 21.9185 24.5274C21.1269 25.656 20.4788 26.4372 19.9793 26.871C19.205 27.5831 18.3754 27.9478 17.487 27.9685C16.8493 27.9685 16.0802 27.7871 15.1849 27.4189C14.2867 27.0525 13.4612 26.871 12.7064 26.871C11.9149 26.871 11.0659 27.0525 10.1578 27.4189C9.24837 27.7871 8.51573 27.9789 7.95557 27.9979C7.10368 28.0342 6.25454 27.6592 5.40697 26.871C4.866 26.3992 4.18935 25.5903 3.37876 24.4444C2.50906 23.2208 1.79404 21.8018 1.23389 20.1841C0.633983 18.4367 0.333252 16.7447 0.333252 15.1065C0.333252 13.2301 0.738721 11.6117 1.55087 10.2554C2.18914 9.16606 3.03828 8.30673 4.10103 7.67588C5.16379 7.04504 6.3121 6.72356 7.54873 6.703C8.22537 6.703 9.1127 6.9123 10.2154 7.32364C11.3149 7.73637 12.021 7.94567 12.3305 7.94567C12.5619 7.94567 13.3463 7.70094 14.6759 7.21303C15.9332 6.76055 16.9944 6.5732 17.8638 6.647C20.2195 6.83712 21.9893 7.76575 23.1663 9.43879C21.0595 10.7153 20.0173 12.5033 20.0381 14.797C20.0571 16.5836 20.7052 18.0703 21.979 19.2508C22.5562 19.7987 23.2009 20.2221 23.9182 20.5228C23.7626 20.9739 23.5984 21.406 23.4239 21.8208ZM18.0211 0.560465C18.0211 1.96078 17.5095 3.26826 16.4898 4.47844C15.2592 5.91712 13.7707 6.74845 12.1567 6.61727C12.1361 6.44928 12.1242 6.27247 12.1242 6.08667C12.1242 4.74236 12.7094 3.30369 13.7486 2.12738C14.2675 1.53179 14.9274 1.03657 15.7276 0.641523C16.5261 0.252369 17.2814 0.037159 17.9917 0.000305176C18.0124 0.187506 18.0211 0.374719 18.0211 0.560447V0.560465Z"
        fill={color ?? "#F92595"}
      />
    </svg>
  );
};

const GoogleIcon = ({ color, ...rest }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="48px"
      height="48px"
      preserveAspectRatio="none"
      {...rest}
    >
      <path
        fill={color ?? "#FFC107"}
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill={color ?? "#FF3D00"}
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill={color ?? "#4CAF50"}
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill={color ?? "#1976D2"}
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
};

const RestartIcon = ({ color, ...rest }: IconProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M1 16.2542C1 24.3981 7.71573 31 16 31C24.2843 31 31 24.3981 31 16.2542C31 8.11037 24.3333 1.50847 16 1.50847C6 1.50847 1 9.70056 1 9.70056M1 9.70056L1 1M1 9.70056H8.7585"
        stroke={color ?? "#FFFFFE"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const PlusIcon = ({ color, ...rest }: IconProps) => {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect
        x="14"
        width="2.5"
        height="30"
        rx="1.25"
        fill={color ?? "#FFFFFE"}
      />
      <rect
        x="30"
        y="14"
        width="2.5"
        height="30"
        rx="1.25"
        transform="rotate(90 30 14)"
        fill={color ?? "#FFFFFE"}
      />
    </svg>
  );
};

const EditIcon = ({ color, ...rest }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.3569 5.96658L5.72752 12.5805C5.50427 12.8032 5.32531 13.066 5.20008 13.3551L4.1847 15.6986C4.11097 15.8688 4.28048 16.0429 4.45329 15.9744L6.7197 15.0768C7.04105 14.9495 7.33247 14.7573 7.5756 14.5122L14.2156 7.81819L12.3569 5.96658ZM15.0959 6.93074L15.6331 6.38921C16.1394 5.8788 16.1369 5.05651 15.6276 4.54912C15.1164 4.03985 14.2878 4.04017 13.777 4.54982L13.2418 5.08374L15.0959 6.93074Z"
        fill={color ?? "#FFFFFE"}
      />
    </svg>
  );
};

const StarIcon = ({ color, ...rest }: IconProps) => {
  return (
    <svg
      width="36"
      height="32"
      viewBox="0 0 36 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M19.1566 0.909036C18.527 -0.303013 16.708 -0.303011 16.0785 0.909038L11.9639 8.83036C11.7139 9.31167 11.2307 9.64527 10.6717 9.72245L1.47138 10.9927C0.0636338 11.1871 -0.498477 12.8308 0.520177 13.7743L7.17757 19.9401C7.58208 20.3148 7.76667 20.8546 7.67118 21.3836L6.09958 30.09C5.85911 31.4221 7.33072 32.438 8.58985 31.8091L16.8189 27.6985C17.3189 27.4487 17.9162 27.4487 18.4162 27.6985L26.6452 31.8091C27.9043 32.438 29.3759 31.4221 29.1354 30.09L27.5638 21.3836C27.4684 20.8546 27.6529 20.3148 28.0575 19.9401L34.7148 13.7743C35.7335 12.8308 35.1714 11.1871 33.7636 10.9927L24.5634 9.72245C24.0043 9.64527 23.5211 9.31167 23.2711 8.83036L19.1566 0.909036Z"
        fill={color ?? "#4A4B52"}
      />
    </svg>
  );
};

const DeleteIcon = ({ color, ...rest }: IconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="23"
        rx="11.5"
        stroke={color ?? "#FFFFFE"}
      />
      <rect
        x="4"
        y="11"
        width="16"
        height="2"
        rx="1"
        fill={color ?? "#FFFFFE"}
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
  ArrowLeftIcon,
  GirlCrushIcon,
  HeartIcon,
  HighHeelIcon,
  MoonIcon,
  GlobalIcon,
  SpinnerIcon,
  LoginIcon,
  UserPlusIcon,
  XIcon,
  AppleIcon,
  GoogleIcon,
  RestartIcon,
  PlusIcon,
  EditIcon,
  StarIcon,
  DeleteIcon,
};

export const Icons = {
  wish: WishIcon,
  home: HomeIcon,
  my: MyIcon,
  location: LocationIcon,
  caretDown: CaretDownIcon,
  arrowRight: ArrowRightIcon,
  arrowLeft: ArrowLeftIcon,
  girlCrush: GirlCrushIcon,
  heart: HeartIcon,
  highHeel: HighHeelIcon,
  moon: MoonIcon,
  global: GlobalIcon,
  spinner: SpinnerIcon,
  login: LoginIcon,
  userPlus: UserPlusIcon,
  restart: RestartIcon,
  plus: PlusIcon,
  edit: EditIcon,
  star: StarIcon,
  delete: DeleteIcon,
};
