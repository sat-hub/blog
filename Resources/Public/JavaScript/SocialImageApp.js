// (($) => {
$(document).ready(() => {
    class CanvasInstance {
        constructor(canvas) {
            this.canvas = canvas;
            this.fabric = new fabric.Canvas(canvas, {
                preserveObjectStacking: true
            });
            // Add Youtube Cover Image
            this.preview = new fabric.Image(document.getElementById('posterImage'), {
                top: 0,
                left: 0,
                scaleX: 0.5,
                scaleY: 0.5,
                crossOrigin: 'use-credentials'
            });
            this.preview.filters.push(new fabric.Image.filters.Sepia());
            this.preview.filters.push(new fabric.Image.filters.Contrast({contrast: -0.6}));
            this.preview.filters.push(new fabric.Image.filters.Brightness({brightness: -0.2}));
            this.preview.applyFilters();
            this.fabric.add(this.preview);

            // Add Author
            this.fabric.add(this._addAuthorText());
            // Add TagLine
            this.fabric.add(this._addTYPO3TagLine());
            this.fabric.add(this._addLine());
            // Add TextBox
            this.text = this._addTextBox();
            this.fabric.add(this.text);
        }

        _addAuthorText() {
            return new fabric.Text(
                $('#author').html(),
                {
                    left: 30,
                    top: (this.canvas.height / 2) - 56,
                    fontSize: 15,
                    fontFamily: 'Source Sans Pro',
                    fontWeight: '600',
                    fill: 'white'
                }
            );
        }

        _addTYPO3TagLine() {
            return new fabric.Text(
                'TYPO3',
                {
                    left: 30,
                    top: (this.canvas.height / 2) - 30,
                    fontSize: 15,
                    fontFamily: 'Source Sans Pro',
                    fontWeight: '600',
                    fill: '#FF8700'
                }
            );
        }

        _addLine() {
            return new fabric.Line(
                [
                    500, 100, 100, 100
                ],
                {
                    left: 30,
                    top: (this.canvas.height / 2) - 35,
                    stroke: '#FF8700'
                }
            );
        }

        _addTextBox() {
            return new fabric.Textbox(
                $('#title').html(),
                {
                    left: 30,
                    top: 30,
                    fontSize: 40,
                    fontFamily: 'Source Sans Pro',
                    fontWeight: '300',
                    textAlign: 'left',
                    fill: 'white',
                    fixedWidth: (this.canvas.width / 2) - 40,
                    width: (this.canvas.width / 2) - 40,
                    // strokeWidth: 1,
                    // stroke: 'black',
                    lockMovementX: true,
                    lockMovementY: true,
                    selectable: false
                }
            );
        }

        setFontSize(fontSize) {
            this.text.set({
                fontSize: fontSize
            });
        }

        scaleImage(scaleFactor) {
            this.preview.set({
                scaleY: scaleFactor,
                scaleX: scaleFactor
            });
        }

        updateText(value) {
            this.text.setText(value);
            this.render();
        }

        render() {
            this.fabric.renderAll();
        }

        download() {
            this.canvas.toDataURL('png');
        }
    }

    let $instances = $('canvas').map((index, canvas) => {
        return new CanvasInstance(canvas);
    });


    let $input = $('.watch');
    $input.on('input', () => {
        let value = $input.val();
        $instances.each((index, instance) => {
            instance.updateText(value);
        });
    });

    // @todo I hate that these two functions are fixed to the dedicted canvas
    // @todo Is there a way to make this easier
    let $linkedInFontSize = $('#linkedInFontSize');
    $linkedInFontSize.on('input', () => {
        let fontSize = $linkedInFontSize.val();
        $instances.each((index, instance) => {
            if ($(instance.canvas).attr('id') === 'preview-linkedin') {
                instance.setFontSize(fontSize);
                instance.render();
            }
        });
    });

    let $linkedInImageScale = $('#linkedInImageScale');
    $linkedInImageScale.on('input', () => {
        let scale = $linkedInImageScale.val();
        $instances.each((index, instance) => {
            if ($(instance.canvas).attr('id') === 'preview-linkedin') {
                instance.scaleImage(scale);
                instance.render();
            }
        });
    });

    let $downloadLinkFacebook = $('.js-download-link-facebook');
    $downloadLinkFacebook.on('click', () => {
        $instances.each((index, instance) => {
            if ($(instance.canvas).attr('id') === 'preview-facebook') {
                $downloadLinkFacebook.attr('href', instance.fabric.toDataURL({
                    format: 'png'
                }));
                $downloadLinkFacebook.attr('download', 'image-facebook.png');
            }
        });
    });

    let $downloadLinkLinkedIn = $('.js-download-link-linkedin');
    $downloadLinkLinkedIn.on('click', () => {
        $instances.each((index, instance) => {
            if ($(instance.canvas).attr('id') === 'preview-linkedin') {
                $downloadLinkLinkedIn.attr('href', instance.fabric.toDataURL({
                    format: 'png'
                }));
                $downloadLinkLinkedIn.attr('download', 'image-linkedin.png');
            }
        });
    });

        $(document).on('click', '.t3js-save-to-field', function() {
            let $link = $(this);
            let file = $link.data('file');
            let fieldIdentiier = $link.data('field');
            let $basePanel = $('#basePanel');
            let $step1Panel = $('#savePanelStep1');
            let $step2Panel = $('#savePanelStep2');
            let $step3Panel = $('#savePanelStep3');
            $.post(
                TYPO3.settings.ajaxUrls['ext-blog-social-wizard-get-relations'],
                {
                    table: $basePanel.data('table'),
                    uid: $basePanel.data('uid'),
                    field: fieldIdentiier
                },
                function(data) {
                    if (data.length > 0) {
                        $step1Panel.slideUp('slow', function() {
                            let $listOfRelations = $('.t3js-list-of-relations');
                            for (let i=0; i<data.length; i++) {
                                let $td = $('<td>');
                                let $tr = $('<tr>');
                                let $img = $('<img>');
                                let $title = $('<strong>');
                                let $button1 = $('<button class="btn btn-danger">');
                                let $button2 = $('<button class="btn btn-default">');

                                $tr.data('fileId', data[i]['referenceId']);
                                $img.attr('src', data[i]['thumb']).attr('width', 100);
                                $title.text(data[i]['title']);
                                $button1.text('replace');
                                $button2.text('insert before');

                                $tr.append($td.clone().append($img));
                                $tr.append($td.clone().append($title));
                                $tr.append($td.clone().append($button1));
                                $tr.append($td.clone().append($button2));
                                $listOfRelations.append($tr);
                            }
                            $listOfRelations.append('<tr><td colspan="4"><button class="btn btn-default">insert here</button></td></tr>');
                            $step2Panel.slideDown();
                        });

                    } else {
                        $step1Panel.slideUp('slow', function() {
                            $step3Panel.slideDown();
                        });
                    }
                },
                'json'
            );
        });

    function slugify(text) {
        return text.toString().toLowerCase().trim()
            .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
            .replace(/[\s_-]+/g, '_') // swap any length of whitespace, underscore, hyphen characters with a single _
            .replace(/^-+|-+$/g, ''); // remove leading, trailing -
    }

        function saveImage(imageContent, name) {
            let $basePanel = $('#basePanel');
            $.post(
                TYPO3.settings.ajaxUrls['ext-blog-social-wizard-save-image'],
                {
                    name: name,
                    data: imageContent,
                    table: $basePanel.data('table'),
                    uid: $basePanel.data('uid')
                },
                function(data) {
                    if (data.status === 'ok') {
                        let $step1Panel = $('#savePanelStep1');
                        $basePanel.slideUp('slow', function() {
                            $step1Panel.find('.t3js-file-link').attr('href', '/' + data.file);
                            $step1Panel.find('.t3js-filepath').text(data.file);
                            let $listOfFields = $step1Panel.find('.t3js-list-of-fields');
                            if (data.fields && data.fields.length) {
                                for (let i=0; i<data.fields.length; i++) {
                                    $listOfFields.append('<li><a href="#" class="t3js-save-to-field" data-file="' + data.file + '" data-field="' + data.fields[i].identifier + '">' + data.fields[i].label + '</a></li>');
                                }
                            } else {
                                $listOfFields.append('<li>Sorry, no image fields found in this record.</li>');
                            }
                            $step1Panel.slideDown();
                        });
                    }
                },
                'json'
            )
        }

    let $saveLinkFacebook = $('.js-save-link-facebook');
    $saveLinkFacebook.on('click', () => {
        $instances.each((index, instance) => {
            if ($(instance.canvas).attr('id') === 'preview-facebook') {
                let data = instance.fabric.toDataURL({
                    format: 'png'
                });
                let name = slugify($('#title').text()) + '-facebook.png';
                saveImage(data, name);
            }
        });
    });

    let $saveLinkLinkedIn = $('.js-save-link-linkedin');
    $saveLinkLinkedIn.on('click', () => {
        $instances.each((index, instance) => {
            if ($(instance.canvas).attr('id') === 'preview-linkedin') {
                let data = instance.fabric.toDataURL({
                    format: 'png'
                });
                let name = slugify($('#title').text()) + '-linkedin.png';
                saveImage(data, name);
            }
        });
    });
});
// })(jQuery);