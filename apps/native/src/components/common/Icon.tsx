import Svg, { Circle, G, Path, type SvgProps } from 'react-native-svg';

export function DangerAlert(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <G fill="none">
        <Path
          stroke="currentColor"
          strokeWidth="1.5"
          d="M5.312 10.762C8.23 5.587 9.689 3 12 3s3.77 2.587 6.688 7.762l.364.644c2.425 4.3 3.638 6.45 2.542 8.022S17.786 21 12.364 21h-.728c-5.422 0-8.134 0-9.23-1.572s.117-3.722 2.542-8.022z"
        />
        <Path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M12 8v5" />
        <Circle cx="12" cy="16" r="1" fill="currentColor" />
      </G>
    </Svg>
  );
}

export function Bulb(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <G fill="none" stroke="currentColor" strokeWidth="1.5">
        <Path d="M14.5 19.5h-5m5 0c0-.713 0-1.07.038-1.307c.123-.763.144-.812.631-1.412c.151-.186.711-.688 1.832-1.692A7.5 7.5 0 1 0 7 15.09c1.12 1.004 1.68 1.505 1.832 1.692c.487.6.508.649.63 1.412c.039.237.039.593.039 1.307m5 0c0 .935 0 1.402-.201 1.75a1.5 1.5 0 0 1-.549.549c-.349.2-.816.2-1.751.2s-1.402 0-1.75-.201a1.5 1.5 0 0 1-.549-.549c-.201-.348-.201-.815-.201-1.75" />
        <Path strokeLinecap="round" strokeLinejoin="round" d="m12.786 8.5l-2.143 3h3l-2.143 3" />
      </G>
    </Svg>
  );
}

export function Eye(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <G fill="none" stroke="currentColor" strokeWidth="1.5">
        <Path d="M3.275 15.296C2.425 14.192 2 13.639 2 12c0-1.64.425-2.191 1.275-3.296C4.972 6.5 7.818 4 12 4s7.028 2.5 8.725 4.704C21.575 9.81 22 10.361 22 12c0 1.64-.425 2.191-1.275 3.296C19.028 17.5 16.182 20 12 20s-7.028-2.5-8.725-4.704Z" />
        <Path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z" />
      </G>
    </Svg>
  );
}

export function Moon(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="m21.067 11.857l-.642-.388zm-8.924-8.924l-.388-.642zM21.25 12A9.25 9.25 0 0 1 12 21.25v1.5c5.937 0 10.75-4.813 10.75-10.75zM12 21.25A9.25 9.25 0 0 1 2.75 12h-1.5c0 5.937 4.813 10.75 10.75 10.75zM2.75 12A9.25 9.25 0 0 1 12 2.75v-1.5C6.063 1.25 1.25 6.063 1.25 12zm12.75 2.25A5.75 5.75 0 0 1 9.75 8.5h-1.5a7.25 7.25 0 0 0 7.25 7.25zm4.925-2.781A5.75 5.75 0 0 1 15.5 14.25v1.5a7.25 7.25 0 0 0 6.21-3.505zM9.75 8.5a5.75 5.75 0 0 1 2.781-4.925l-.776-1.284A7.25 7.25 0 0 0 8.25 8.5zM12 2.75a.38.38 0 0 1-.268-.118a.3.3 0 0 1-.082-.155c-.004-.031-.002-.121.105-.186l.776 1.284c.503-.304.665-.861.606-1.299c-.062-.455-.42-1.026-1.137-1.026zm9.71 9.495c-.066.107-.156.109-.187.105a.3.3 0 0 1-.155-.082a.38.38 0 0 1-.118-.268h1.5c0-.717-.571-1.075-1.026-1.137c-.438-.059-.995.103-1.299.606z"
      />
    </Svg>
  );
}

export function Stopwatch(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <G fill="none" stroke="currentColor" strokeWidth="1.5">
        <Path d="M21 13a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z" />
        <Path strokeLinecap="round" strokeLinejoin="round" d="M12 13V9" />
        <Path strokeLinecap="round" d="M10 2h4" />
      </G>
    </Svg>
  );
}

export function ErrorIcon(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.493 2 11.953 2M12 20c-4.411 0-8-3.589-8-8s3.567-8 7.953-8C16.391 4 20 7.589 20 12s-3.589 8-8 8"
      />
      <Path fill="currentColor" d="M11 7h2v7h-2zm0 8h2v2h-2z" />
    </Svg>
  );
}

export function Volume(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <G fill="none" stroke="currentColor" strokeWidth="1.5">
        <Path d="M1.535 10.971c.073-1.208.11-1.813.424-2.394a3.2 3.2 0 0 1 1.38-1.3C3.94 7 4.627 7 6 7c.512 0 .768 0 1.016-.042a3 3 0 0 0 .712-.214c.23-.101.444-.242.871-.524l.22-.144C11.36 4.399 12.632 3.56 13.7 3.925c.205.07.403.17.58.295c.922.648.993 2.157 1.133 5.174A68 68 0 0 1 15.5 12c0 .532-.035 1.488-.087 2.605c-.14 3.018-.21 4.526-1.133 5.175a2.3 2.3 0 0 1-.58.295c-1.067.364-2.339-.474-4.882-2.151L8.6 17.78c-.427-.282-.64-.423-.871-.525a3 3 0 0 0-.712-.213C6.768 17 6.512 17 6 17c-1.374 0-2.06 0-2.66-.277a3.2 3.2 0 0 1-1.381-1.3c-.314-.582-.35-1.186-.424-2.395A17 17 0 0 1 1.5 12c0-.323.013-.671.035-1.029Z" />
        <Path strokeLinecap="round" d="M20 6s1.5 1.8 1.5 6s-1.5 6-1.5 6m-2-9s.5.9.5 3s-.5 3-.5 3" />
      </G>
    </Svg>
  );
}

export function Vibrate(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <G fill="none" stroke="currentColor" strokeWidth="1.5">
        <Path d="M5 8c0-2.828 0-4.243.879-5.121C6.757 2 8.172 2 11 2h2c2.828 0 4.243 0 5.121.879C19 3.757 19 5.172 19 8v8c0 2.828 0 4.243-.879 5.121C17.243 22 15.828 22 13 22h-2c-2.828 0-4.243 0-5.121-.879C5 20.243 5 18.828 5 16z" />
        <Path strokeLinecap="round" d="M14.5 19h-5" />
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m22 6l-.776 1.553a1 1 0 0 0 0 .894l.552 1.106a1 1 0 0 1 0 .894l-.552 1.106a1 1 0 0 0 0 .894l.552 1.106a1 1 0 0 1 0 .894l-.552 1.106a1 1 0 0 0 0 .894L22 18M2 6l.776 1.553a1 1 0 0 1 0 .894l-.552 1.106a1 1 0 0 0 0 .894l.552 1.106a1 1 0 0 1 0 .894l-.552 1.106a1 1 0 0 0 0 .894l.552 1.106a1 1 0 0 1 0 .894L2 18"
        />
      </G>
    </Svg>
  );
}

export function Share(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <G fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
        <Path d="M22 13.998c-.029 3.414-.218 5.296-1.46 6.537C19.076 22 16.718 22 12.003 22s-7.073 0-8.538-1.465S2 16.713 2 11.997C2 7.282 2 4.924 3.465 3.46C4.706 2.218 6.588 2.029 10.002 2" />
        <Path
          strokeLinejoin="round"
          d="M22 7h-8c-1.818 0-2.913.892-3.32 1.3q-.187.19-.19.19q0 .003-.19.19C9.892 9.087 9 10.182 9 12v3m13-8l-5-5m5 5l-5 5"
        />
      </G>
    </Svg>
  );
}

export function Shield(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        d="M3 10.417c0-3.198 0-4.797.378-5.335c.377-.537 1.88-1.052 4.887-2.081l.573-.196C10.405 2.268 11.188 2 12 2s1.595.268 3.162.805l.573.196c3.007 1.029 4.51 1.544 4.887 2.081C21 5.62 21 7.22 21 10.417v1.574c0 5.638-4.239 8.375-6.899 9.536C13.38 21.842 13.02 22 12 22s-1.38-.158-2.101-.473C7.239 20.365 3 17.63 3 11.991z"
      />
    </Svg>
  );
}

export function Sun(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <G fill="none" stroke="currentColor" strokeWidth="1.5">
        <Circle cx="12" cy="12" r="5" />
        <Path
          strokeLinecap="round"
          d="M12 2v2m0 16v2M4 12H2m20 0h-2m-.222-7.777l-2.222 2.031M4.222 4.223l2.222 2.031m0 11.302l-2.222 2.222m15.556-.001l-2.222-2.222"
        />
      </G>
    </Svg>
  );
}

export function SolarStarLinear(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        d="M9.153 5.408C10.42 3.136 11.053 2 12 2s1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182s.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776c.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18c-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506s-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452s-.674.15-1.328.452l-.596.274c-2.303 1.06-3.455 1.59-4.22 1.01c-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116 0-1.46c-.106-.345-.345-.624-.821-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882S3.58 8.328 6.04 7.772l.636-.144c.699-.158 1.048-.237 1.329-.45s.46-.536.82-1.182z"
      />
    </Svg>
  );
}

export function Language(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <G
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        color="currentColor"
      >
        <Path d="M7 8.38h4.5m5.5 0h-2.5m-3 0h3m-3 0V7m3 1.38c-.527 1.886-1.632 3.669-2.893 5.236M8.393 17c1.019-.937 2.17-2.087 3.214-3.384m0 0c-.643-.754-1.543-1.973-1.8-2.525m1.8 2.525l1.929 2.005" />
        <Path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12" />
      </G>
    </Svg>
  );
}

export function Check(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="m10.5 13.4l4.9-4.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-5.6 5.6q-.3.3-.7.3t-.7-.3l-2.6-2.6q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l1.9 1.9Z"
      />
    </Svg>
  );
}

export function Globe(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0m6-9v18m6-9a9 9 0 0 1-6-9a9 9 0 0 1 6 9z"
      />
    </Svg>
  );
}

export function Trophy(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 9h1.5a2.5 2.5 0 0 1 0 5H6m12 0h-1.5a2.5 2.5 0 0 0 0-5H18m-6-6v12m0-12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3m0-12a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3m0 3v3m-2 0h4"
      />
    </Svg>
  );
}

export function Calendar(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
      />
    </Svg>
  );
}

export function Star(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </Svg>
  );
}

export function Leaf(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="m21.88 2.15l-1.2.4a13.84 13.84 0 0 1-6.41.64a11.87 11.87 0 0 0-6.68.9A7.23 7.23 0 0 0 3.3 9.5a8.65 8.65 0 0 0 1.47 6.6c-.06.21-.12.42-.17.63A22.6 22.6 0 0 0 4 22h2a31 31 0 0 1 .59-4.32a9.25 9.25 0 0 0 4.52 1.11a11 11 0 0 0 4.28-.87C23 14.67 22 3.86 22 3.41zm-7.27 13.93c-2.61 1.11-5.73.92-7.48-.45a13.8 13.8 0 0 1 1.21-2.84A10.2 10.2 0 0 1 9.73 11a9 9 0 0 1 1.81-1.42A12 12 0 0 1 16 8V7a11.4 11.4 0 0 0-5.26 1.08a10.3 10.3 0 0 0-4.12 3.65a15 15 0 0 0-1 1.87a7 7 0 0 1-.38-3.73a5.24 5.24 0 0 1 3.14-4a8.9 8.9 0 0 1 3.82-.84c.62 0 1.23.06 1.87.11a16.2 16.2 0 0 0 6-.35C20 7.55 19.5 14 14.61 16.08"
      />
    </Svg>
  );
}

export function ChevronLeft(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m15 18l-6-6l6-6"
      />
    </Svg>
  );
}

export function ChevronRight(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m9 18l6-6l-6-6"
      />
    </Svg>
  );
}

export function MoreVertical(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2z"
      />
    </Svg>
  );
}

export function Settings(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <G fill="none" stroke="currentColor" strokeWidth="1.5">
        <Path d="M7.843 3.802C9.872 2.601 10.886 2 12 2s2.128.6 4.157 1.802l.686.406c2.029 1.202 3.043 1.803 3.6 2.792c.557.99.557 2.19.557 4.594v.812c0 2.403 0 3.605-.557 4.594s-1.571 1.59-3.6 2.791l-.686.407C14.128 21.399 13.114 22 12 22s-2.128-.6-4.157-1.802l-.686-.407c-2.029-1.2-3.043-1.802-3.6-2.791C3 16.01 3 14.81 3 12.406v-.812C3 9.19 3 7.989 3.557 7s1.571-1.59 3.6-2.792z" />
        <Circle cx="12" cy="12" r="3" />
      </G>
    </Svg>
  );
}

export function ChevronDown(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m6 9l6 6l6-6"
      />
    </Svg>
  );
}

export function MoreHorizontal(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Circle cx="12" cy="12" r="1" fill="currentColor" />
      <Circle cx="19" cy="12" r="1" fill="currentColor" />
      <Circle cx="5" cy="12" r="1" fill="currentColor" />
    </Svg>
  );
}

export function Download(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="M12 6.25a.75.75 0 0 1 .75.75v5.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V7a.75.75 0 0 1 .75-.75M7.25 17a.75.75 0 0 1 .75-.75h8a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75"
      />
      <Path
        fill="currentColor"
        fillRule="evenodd"
        d="M11.943 1.25c-2.309 0-4.118 0-5.53.19c-1.444.194-2.584.6-3.479 1.494c-.895.895-1.3 2.035-1.494 3.48c-.19 1.411-.19 3.22-.19 5.529v.114c0 2.309 0 4.118.19 5.53c.194 1.444.6 2.584 1.494 3.479c.895.895 2.035 1.3 3.48 1.494c1.411.19 3.22.19 5.529.19h.114c2.309 0 4.118 0 5.53-.19c1.444-.194 2.584-.6 3.479-1.494c.895-.895 1.3-2.035 1.494-3.48c.19-1.411.19-3.22.19-5.529v-.114c0-2.309 0-4.118-.19-5.53c-.194-1.444-.6-2.584-1.494-3.479c-.895-.895-2.035-1.3-3.48-1.494c-1.411-.19-3.22-.19-5.529-.19zM3.995 3.995c.57-.57 1.34-.897 2.619-1.069c1.3-.174 3.008-.176 5.386-.176s4.086.002 5.386.176c1.279.172 2.05.5 2.62 1.069c.569.57.896 1.34 1.068 2.619c.174 1.3.176 3.008.176 5.386s-.002 4.086-.176 5.386c-.172 1.279-.5 2.05-1.069 2.62c-.57.569-1.34.896-2.619 1.068c-1.3.174-3.008.176-5.386.176s-4.086-.002-5.386-.176c-1.279-.172-2.05-.5-2.62-1.069c-.569-.57-.896-1.34-1.068-2.619c-.174-1.3-.176-3.008-.176-5.386s.002-4.086.176-5.386c.172-1.279.5-2.05 1.069-2.62"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export function CloudOff(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M6.286 19C3.919 19 2 17.104 2 14.765s1.919-4.236 4.286-4.236q.427.001.83.08m7.265-2.582a5.8 5.8 0 0 1 1.905-.321c.654 0 1.283.109 1.87.309m-11.04 2.594a5.6 5.6 0 0 1-.354-1.962C6.762 5.528 9.32 3 12.476 3c2.94 0 5.361 2.194 5.68 5.015m-11.04 2.594a4.3 4.3 0 0 1 1.55.634m9.49-3.228C20.392 8.78 22 10.881 22 13.353c0 2.707-1.927 4.97-4.5 5.52m-4-1.373L12 19m0 0l-1.5 1.5M12 19l-1.5-1.5M12 19l1.5 1.5"
      />
    </Svg>
  );
}

export function Cloud(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <G fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
        <Path d="M6.286 19C3.919 19 2 17.104 2 14.765s1.919-4.236 4.286-4.236q.427.001.83.08m7.265-2.582a5.8 5.8 0 0 1 1.905-.321c.654 0 1.283.109 1.87.309m-11.04 2.594a5.6 5.6 0 0 1-.354-1.962C6.762 5.528 9.32 3 12.476 3c2.94 0 5.361 2.194 5.68 5.015m-11.04 2.594a4.3 4.3 0 0 1 1.55.634m9.49-3.228C20.392 8.78 22 10.881 22 13.353c0 2.707-1.927 4.97-4.5 5.52" />
        <Path strokeLinejoin="round" d="M12 16v6m0-6l2 2m-2-2l-2 2" />
      </G>
    </Svg>
  );
}

export function Lock(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <G fill="none" stroke="currentColor" strokeWidth="1.5">
        <Path d="M2 16c0-2.828 0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16s0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16Z" />
        <Path strokeLinecap="round" d="M12 14v4m-6-8V8a6 6 0 1 1 12 0v2" />
      </G>
    </Svg>
  );
}

export function GoogleIcon(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <Path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <Path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <Path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <Path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </Svg>
  );
}

export function AppIcon(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="50 50 400 400" {...props}>
      <Path
        fill={props.color || '#5b6ef5'}
        d="M242.188 125C268.066 125 289.062 144.761 289.062 169.118C289.062 193.474 268.066 213.235 242.188 213.235C216.309 213.235 195.312 193.474 195.312 169.118C195.312 144.761 216.309 125 242.188 125ZM125 279.412C125 247.197 147.949 219.026 182.178 203.631C194.531 222.61 216.797 235.294 242.188 235.294C269.385 235.294 293.018 220.726 304.688 199.449C312.402 194.256 321.826 191.176 332.031 191.176H341.553C346.631 191.176 350.342 195.68 349.121 200.322L340.771 231.71C345.605 237.408 349.658 243.52 352.686 250H363.281C369.775 250 375 254.917 375 261.029V312.5C375 318.612 369.775 323.529 363.281 323.529H343.75C335.693 333.64 324.951 341.728 312.5 346.829V360.294C312.5 368.428 305.518 375 296.875 375H280.762C273.779 375 267.676 370.634 265.723 364.338L262.256 352.941H222.07L218.604 364.338C216.699 370.634 210.596 375 203.613 375H187.5C178.857 375 171.875 368.428 171.875 360.294V346.829C144.287 335.478 125 309.559 125 279.412ZM308.594 286.765C315.088 286.765 320.312 281.847 320.312 275.735C320.312 269.623 315.088 264.706 308.594 264.706C302.1 264.706 296.875 269.623 296.875 275.735C296.875 281.847 302.1 286.765 308.594 286.765Z"
      />
    </Svg>
  );
}
