import { Image, Upload } from 'antd';
import type { UploadProps } from 'antd/es/upload';
import { UploadFile, UploadListType } from 'antd/lib/upload/interface';
import React, { ReactNode } from 'react';
// import axiosInstance, { ApiClient } from 'services/ApiService';
// import { notificationError } from 'utils/notification';
type uploadType = 'single' | 'list';
interface IProps {
    onSuccessUpload: (file: UploadFile | string | null) => void;

    isUploadServerWhenUploading?: boolean;
    isShowFileList?: boolean;
    children?: ReactNode;
    uploadType?: uploadType;
    accept?: string;
    listType?: UploadListType;
    maxLength?: number;
    initialFile?: any;
    disabled?: boolean;
}

export const imageUpload = async (file: any) => {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', 'breqd0hm');
    formData.append('cloud_name', 'hunre');

    const res = await fetch('https://api.cloudinary.com/v1_1/hunre/image/upload', {
        method: 'POST',
        body: formData,
    });

    const data = await res.json();
    return { public_id: data.public_id, url: data.secure_url };
};

const UploadCloundComponent: React.FC<IProps> = ({
    accept = 'image/*',
    listType = 'text',
    uploadType = 'single',
    isShowFileList = true,
    isUploadServerWhenUploading = false,
    onSuccessUpload,
    children,
    maxLength = 5,
    initialFile,
    disabled,
}) => {
    const [files, setFiles] = React.useState<UploadFile[]>([]);
    console.log('🚀 ~ file: index.tsx:51 ~ files', files);
    const [progress, setProgress] = React.useState(0);
    const [visiblePreview, setVisiblePreview] = React.useState(false);

    const firstLoad = React.useRef(false);

    const uploadImage = async (options: any) => {
        const { onSuccess, onError, file, onProgress } = options;

        if (files.length > maxLength) {
            file.status = 'error';
            const error = new Error('Some error');
            if (uploadType === 'single') {
                setFiles([file]);
            } else {
                setFiles((f) => [...f.filter((_f) => _f.status !== 'uploading'), file]);
            }
            onError({ error });
        }
        if (isUploadServerWhenUploading) {
            const fmData = new FormData();
            const config = {
                headers: {
                    Accept: 'multipart/form-data',
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (event: any) => {
                    const percent = Math.floor((event.loaded / event.total) * 100);
                    setProgress(percent);
                    if (percent === 100) {
                        setTimeout(() => setProgress(0), 1000);
                    }
                    onProgress({ percent: (event.loaded / event.total) * 100 });
                },
            };
            try {
                const photo: any = await imageUpload(file);

                if (photo) {
                    onSuccessUpload(photo);
                    onSuccess('ok');
                } else {
                    file.status = 'error';
                    const error = new Error('Some error');
                    if (uploadType === 'single') {
                        setFiles([file]);
                    } else {
                        setFiles((f) => [...f.filter((_f) => _f.status !== 'uploading'), file]);
                    }
                    onError({ error });
                }
            } catch (err) {
                file.status = 'error';
                const error = new Error('Some error');
                if (uploadType === 'single') {
                    setFiles([file]);
                } else {
                    setFiles((f) => [...f.filter((_f) => _f.status !== 'uploading'), file]);
                }
                onError({ error });
            }
        } else {
            setTimeout(() => onSuccess('ok'), 1000);
        }
    };

    const handleOnChange: UploadProps['onChange'] = ({ file, fileList, event }) => {
        if (file.status !== 'error') {
            setFiles(fileList);
        }
        if (file.status !== 'removed') {
            !isUploadServerWhenUploading && onSuccessUpload(file);
        }
    };

    const handlePreview = async (file: UploadFile) => {
        setVisiblePreview(true);
        return;
    };

    React.useEffect(() => {
        if (firstLoad?.current) return;
        if (initialFile?.[0]?.url) {
            setFiles(initialFile);
            firstLoad.current = true;
        }
    }, [initialFile]);

    return (
        <>
            <Upload
                disabled={disabled}
                accept={accept}
                customRequest={uploadImage}
                onChange={handleOnChange}
                listType={listType}
                fileList={isShowFileList ? files : []}
                onPreview={handlePreview}
                onRemove={() => onSuccessUpload(null)}
            >
                {files.length >= maxLength ? null : uploadType === 'single' && files.length >= 1 ? null : listType ===
                  'text' ? (
                    children
                ) : (
                    <div>+</div>
                )}
            </Upload>
            {listType !== 'text' && (
                <Image.PreviewGroup
                    preview={{
                        visible: visiblePreview,
                        onVisibleChange: (visible) => setVisiblePreview(visible),
                    }}
                >
                    {files.map((file: any, index: number) => {
                        return (
                            <Image
                                key={Math.random()}
                                src={file?.thumbUrl || file.url}
                                width={0}
                                style={{ display: 'none' }}
                            />
                        );
                    })}
                </Image.PreviewGroup>
            )}
        </>
    );
};

export default UploadCloundComponent;
