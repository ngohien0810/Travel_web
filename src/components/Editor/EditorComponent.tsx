import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

import AxiosClient from '@/apis/AxiosClient';
import useDebounce from '@/hooks/useDebounce';

const checkImage = (file: File) => {
    const types = ['image/png', 'image/jpeg', 'image/jpg'];
    let err = '';
    if (!file) return (err = 'Tập tin không tồn tại.');

    if (types.includes(file.type)) {
        if (file?.size > 2 * 1024 * 1024) {
            err = 'Kích cỡ hình ảnh trong nội dung vượt quá 2 MB.';
        }
    } else if (file?.type === 'video/mp4') {
        if (file?.size > 5 * 1024 * 1024) {
            err = 'Dung lượng video trong nội dung nhỏ hơn 5 MB';
        }
    }

    // file type video

    return err;
};

const NewsEditor = ({
    disabled,
    handleCallbackContent,
    refContent,
}: {
    disabled?: boolean;
    refContent?: any;
    handleCallbackContent: (value: string) => void;
}) => {
    const [content, setContent] = React.useState('');
    const debounceContent = useDebounce(content, 300);

    React.useEffect(() => {
        handleCallbackContent(debounceContent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceContent]);

    React.useEffect(() => {
        setContent(refContent);
    }, [refContent]);

    return (
        <>
            <input id="my-file-upload" accept="image/*" type="file" name="my-file-upload" style={{ display: 'none' }} />
            <Editor
                disabled={disabled}
                value={content}
                onEditorChange={(ct: any) => {
                    setContent(ct);
                }}
                apiKey="hjuz02bsvcykwi6ruki9xpuarsd6l8txzaouzknog6xef2w5"
                init={{
                    placeholder: 'Nhập nôi dung tin tức ...',
                    height: 680,
                    content_style: 'body { font-family:Quicksand,sans-serif; font-size:14px }',
                    plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'preview',
                        'searchreplace',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                        'help',
                        'wordcount',
                    ],
                    toolbar:
                        'undo redo | blocks | ' +
                        'image media ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',

                    default_link_target: '_blank',
                    entity_encoding: 'raw',
                    menubar: true,
                    statubar: true,
                    branding: false,
                    file_picker_callback: async function (callback: any, value: any, meta: any) {
                        if (meta?.filetype === 'image') {
                            let input: any = document.getElementById('my-file-upload');
                            input.click();
                            input.onchange = async () => {
                                var file = input.files[0];
                                const check = checkImage(file);
                                if (check !== '' && check) {
                                    return;
                                }

                                const fmData = new FormData();
                                const config = {
                                    headers: {
                                        Accept: 'multipart/form-data',
                                        'Content-Type': 'multipart/form-data',
                                    },
                                };
                                // fmData.append('file', file);
                                // AxiosClient.post('/files/upload/single/image', fmData, config).then((res) => {
                                //     if (res?.data?.url) {
                                //         callback(res?.data?.url, {
                                //             alt: file.name,
                                //         });
                                //     }
                                // });
                            };
                        }
                    },
                }}
            />
        </>
    );
};

export default NewsEditor;
