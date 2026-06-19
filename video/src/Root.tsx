import {Composition} from 'remotion';
import {VibeTipFlow} from './VibeTipFlow';

export const RemotionRoot = () => {
  return (
    <Composition
      id="VibeTipFlow"
      component={VibeTipFlow}
      durationInFrames={840}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
