import '../frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'inlineAudio',
  baseConfiguration: {
    id: filePermaId('audioFiles', 'quicktime_jingle'),
    autoplay: false,
    controls: false
  },
  variants: [
    {
      name: 'with poster image',
      configuration: {
        posterId: filePermaId('imageFiles', 'turtle')
      }
    }
  ]

});
