import {Configuration, FileInputView} from 'pageflow/editor';

import * as support from '$support';
import {DropDownButton} from '$support/dominos/editor';

describe('FileInputView', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  it('can render button to edit background position', () => {
    var fixture = support.factories.videoFileWithTextTrackFiles({
      videoFileAttributes: {perma_id: 5, file_name: 'video.mp4', state: 'encoded'}
    });
    var model = new Configuration({
      file_id: 5,
    });

    var fileInputView = new FileInputView({
      collection: fixture.videoFiles,
      model: model,
      propertyName: 'file_id',
      positioning: true
    });

    fileInputView.render();
    var dropDownButton = DropDownButton.find(fileInputView);

    expect(dropDownButton.menuItemNames()).toEqual(expect.arrayContaining(['edit_background_positioning']));
  });

  it('can render additional drop down menu item', () => {
    const fixture = support.factories.imageFilesFixture({
      imageFileAttributes: {perma_id: 5}
    });
    const model = new Configuration({
      file_id: 5,
    });
    const handler = jest.fn();

    var fileInputView = new FileInputView({
      collection: fixture.imageFiles,
      model: model,
      propertyName: 'file_id',
      dropDownMenuItems: [
        {
          name: 'custom',
          label: 'Custom Item',
          selected: handler
        }
      ]
    });

    fileInputView.render();
    var dropDownButton = DropDownButton.find(fileInputView);
    dropDownButton.selectMenuItemByLabel('Custom Item');

    expect(handler).toHaveBeenCalledWith({
      inputModel: model,
      propertyName: 'file_id',
      file: fixture.imageFile
    });
  });

  describe('for selecting a default text track file', () => {
    beforeEach(() => {
      testContext.fixture = support.factories.videoFileWithTextTrackFiles({
        videoFileAttributes: {perma_id: 5, file_name: 'video.mp4', state: 'encoded'},
        textTrackFilesAttributes: [
          {
            id: 1,
            perma_id: 10,
            configuration: {
              label: 'English'
            }
          },
          {
            id: 2,
            perma_id: 11,
            configuration: {
              label: 'German'
            }
          }
        ]
      });
    });

    it('displays text track files', () => {
      var model = new Configuration({
        file_id: 5,
      });

      var fileInputView = new FileInputView({
        collection: testContext.fixture.videoFiles,
        model: model,
        propertyName: 'file_id',
        textTrackFiles: testContext.fixture.textTrackFiles,
        defaultTextTrackFilePropertyName: 'default_text_track_file_id'
      });

      fileInputView.render();
      var dropDownButton = DropDownButton.find(fileInputView);

      expect(dropDownButton.menuItemLabels()).toEqual(expect.arrayContaining(['English']));
      expect(dropDownButton.menuItemLabels()).toEqual(expect.arrayContaining(['German']));
    });

    it('allows selecting default text track file', () => {
      var model = new Configuration({
        file_id: 5,
      });

      var fileInputView = new FileInputView({
        collection: testContext.fixture.videoFiles,
        model: model,
        propertyName: 'file_id',
        textTrackFiles: testContext.fixture.textTrackFiles,
        defaultTextTrackFilePropertyName: 'default_text_track_file_id'
      });

      fileInputView.render();
      var dropDownButton = DropDownButton.find(fileInputView);
      dropDownButton.selectMenuItemByLabel('English');

      expect(model.get('default_text_track_file_id')).toBe(10);
    });

    it('allows unsetting default text track file', () => {
      var model = new Configuration({
        file_id: 5,
        default_text_track_file_id: 10
      });

      var fileInputView = new FileInputView({
        collection: testContext.fixture.videoFiles,
        model: model,
        propertyName: 'file_id',
        textTrackFiles: testContext.fixture.textTrackFiles,
        defaultTextTrackFilePropertyName: 'default_text_track_file_id'
      });

      fileInputView.render();
      var dropDownButton = DropDownButton.find(fileInputView);
      dropDownButton.selectMenuItemByName('no_default_text_track');

      expect(model.get('default_text_track_file_id')).toBeNull();
    });
  });
});
