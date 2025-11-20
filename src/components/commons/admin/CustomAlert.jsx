// 사용한 컴포넌트 모음
import Btn from './forms/Btn.jsx';
// 사용한 이미지 모음
import WarnIcon from '../../../assets/img/icon/exclamation.svg';
import CompleteIcon from '../../../assets/img/icon/complete.svg';
import CancelIcon from '../../../assets/img/icon/cancel.svg';
import React from "react";

const ICON_MODES = {
    WARN: 'warn',
    COMPLETE: 'complete',
    CANCEL: 'cancel'
}

const CustomAlert = ({
                         title='경고',
                         iconMode=ICON_MODES.WARN,
                         message='',
                         onClose,
                         isOpen = true,
                         confirmButton = false, // 확인 버튼 설정
                         cancelButton = false,  // 취소 버튼 설정
                         onConfirm,
                         onCancel
                     }) => {
    // 1. 아이콘 로직: React 컴포넌트를 직접 불러오기
    let IconComponent;
    switch (iconMode) {
        case ICON_MODES.WARN:
            IconComponent = WarnIcon;
            break;
        case ICON_MODES.COMPLETE:
            IconComponent = CompleteIcon;
            break;
        case ICON_MODES.CANCEL:
            IconComponent = CancelIcon;
            break;
        default:
            IconComponent = null;
    }

    // 2. 배경 클릭 핸들러: 외부 클릭으로 모달 닫기
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget && onClose) {
            onClose(); // isOpen 상태를 false로 업데이트
        }
    };

    return (
        <div
            className={`custom-alert-overlay ${isOpen ? 'open' : ''}`}
            onClick={handleBackgroundClick}
        >
            <div className="custom-alert">
                <div className="custom-alert-header">
                    {IconComponent && <img src={`${IconComponent}`} alt="" className="icon" />}
                    <span className="title">{title}</span>
                </div>
                <div className="custom-alert-message">
                    {message}
                </div>
                {(confirmButton || cancelButton) && (
                    <div className="custom-alert-actions">
                        {/* 확인 버튼 렌더링 */}
                        {confirmButton && (
                            <Btn
                                size="sm"
                                minWidth="80px"
                                colorMode={confirmButton.colorMode || true}
                                onClick={() => {
                                    if (onConfirm) {
                                        onConfirm(); // 상위 컴포넌트의 기능 실행
                                    }
                                }}
                            >
                                {confirmButton.text || '확인'}
                            </Btn>
                        )}
                        {/* 취소 버튼 렌더링 */}
                        {cancelButton && (
                            <Btn
                                size="sm"
                                minWidth="80px"
                                colorMode={cancelButton.colorMode || false}
                                onClick={() => {
                                    if (onCancel) {
                                        onCancel(); // 상위 컴포넌트의 기능 실행
                                    } else if (onClose) {
                                        onClose(); // 취소는 기본적으로 모달 닫기
                                    }
                                }}
                            >
                                {cancelButton.text || '취소'}
                            </Btn>
                        )}

                    </div>
                )}
            </div>
        </div>
    )
}
export default CustomAlert