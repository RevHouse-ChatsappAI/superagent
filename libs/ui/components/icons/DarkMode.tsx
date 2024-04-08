import React from "react"

export const DarkMode = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" fill="white" fillOpacity="0.01" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.63998 0.799974C4.63998 0.446511 4.35344 0.159973 3.99998 0.159973C3.64651 0.159973 3.35998 0.446511 3.35998 0.799974V1.75998H2.39998C2.04651 1.75998 1.75998 2.04651 1.75998 2.39998C1.75998 2.75344 2.04651 3.03998 2.39998 3.03998H3.35998V3.99998C3.35998 4.35344 3.64651 4.63998 3.99998 4.63998C4.35344 4.63998 4.63998 4.35344 4.63998 3.99998V3.03998H5.59998C5.95344 3.03998 6.23998 2.75344 6.23998 2.39998C6.23998 2.04651 5.95344 1.75998 5.59998 1.75998H4.63998V0.799974ZM9.43998 5.59998C9.43998 5.24651 9.15344 4.95998 8.79998 4.95998C8.44651 4.95998 8.15998 5.24651 8.15998 5.59998V6.55998H7.19998C6.84651 6.55998 6.55998 6.84651 6.55998 7.19998C6.55998 7.55344 6.84651 7.83998 7.19998 7.83998H8.15998V8.79998C8.15998 9.15344 8.44651 9.43998 8.79998 9.43998C9.15344 9.43998 9.43998 9.15344 9.43998 8.79998V7.83998H10.4C10.7534 7.83998 11.04 7.55344 11.04 7.19998C11.04 6.84651 10.7534 6.55998 10.4 6.55998H9.43998V5.59998ZM3.03998 10.4C3.03998 10.0465 2.75344 9.75998 2.39998 9.75998C2.04651 9.75998 1.75998 10.0465 1.75998 10.4V11.36H0.799974C0.446511 11.36 0.159973 11.6465 0.159973 12C0.159973 12.3534 0.446511 12.64 0.799974 12.64H1.75998V13.6C1.75998 13.9534 2.04651 14.24 2.39998 14.24C2.75344 14.24 3.03998 13.9534 3.03998 13.6V12.64H3.99998C4.35344 12.64 4.63998 12.3534 4.63998 12C4.63998 11.6465 4.35344 11.36 3.99998 11.36H3.03998V10.4ZM13.6705 1.57096L13.1939 1.50655C12.8524 1.46829 12.6511 1.86481 12.847 2.14712C13.0722 2.47168 13.2797 2.80948 13.4681 3.15913C14.2701 4.64777 14.7252 6.35092 14.7252 8.16037C14.7252 13.3952 10.916 17.7405 5.9182 18.5755C5.53179 18.64 5.13582 18.6835 4.73614 18.705C4.39302 18.7232 4.20368 19.1256 4.44355 19.3715C4.55283 19.4837 4.66457 19.5933 4.77868 19.7005L4.89414 19.8072L5.31014 20.1672L5.61096 20.4051L5.80475 20.5493L6.10387 20.7587L6.38528 20.9424C6.57881 21.0642 6.77659 21.18 6.97852 21.2895L7.39995 21.5059L7.81686 21.6971L8.3014 21.8925L8.69072 22.0298C8.90504 22.1005 9.1224 22.1647 9.34172 22.2216C9.5082 22.2648 9.67628 22.3042 9.84649 22.3395C10.0479 22.3813 10.2514 22.4175 10.4567 22.4477L10.9639 22.5096L11.391 22.5427C11.5942 22.5544 11.799 22.5603 12.0052 22.5603C17.8373 22.5603 22.5651 17.8325 22.5651 12.0004C22.5651 11.6007 22.5429 11.2062 22.4997 10.8181L22.4408 10.3745C22.3856 10.0173 22.3125 9.66608 22.2226 9.32228C22.1141 8.90736 21.9811 8.50238 21.8255 8.11011L21.6447 7.68212L21.5211 7.41668L21.4026 7.17867C21.1485 6.68438 20.8565 6.21273 20.5299 5.76678L20.2851 5.44564L19.9669 5.06292L19.7051 4.77379L19.5138 4.57523L19.2568 4.32395L18.9015 4.00296L18.388 3.58707L17.9973 3.30398L17.5299 2.99915L17.0154 2.70232L16.4917 2.43806L16.3101 2.35483L15.9278 2.19297L15.4847 2.02705L15.0811 1.89537L14.5612 1.75184L14.1376 1.65579L13.6705 1.57096ZM16.6451 8.48038C16.6451 6.84142 16.3203 5.27728 15.7319 3.84968C18.8197 5.26393 20.9651 8.3818 20.9651 12.0004C20.9651 16.9488 16.9536 20.9603 12.0052 20.9603C10.6183 20.9603 9.30556 20.6458 8.13369 20.0835C10.4671 19.3506 12.4973 17.9331 13.9892 16.0666C14.2074 16.3655 14.5605 16.5595 14.9589 16.5595C15.6216 16.5595 16.1589 16.0223 16.1589 15.3595C16.1589 14.7881 15.7595 14.31 15.2246 14.1891C15.3239 14.0027 15.4185 13.8134 15.5082 13.6213C15.8137 13.8106 16.1741 13.9199 16.56 13.9199C17.6645 13.9199 18.56 13.0245 18.56 11.9199C18.56 10.8156 17.665 9.9204 16.5608 9.9199C16.6165 9.4478 16.6451 8.96744 16.6451 8.48038Z"
        fill="white"
      />
    </svg>
  )
}
