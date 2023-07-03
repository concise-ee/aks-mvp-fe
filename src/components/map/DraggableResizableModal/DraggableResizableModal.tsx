import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import Draggable from 'react-draggable';
import { Control } from 'ol/control';
import { Box, BoxProps, Grid, GridProps, Grow, IconButton, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close, CropSquare, Minimize } from '@mui/icons-material';
import MapContext from '../MapContainer/MapContext';
import {
  calculateMaxSize,
  calculateSize,
  DEFAULT_MIN_SIZE,
  DEFAULT_SIZE,
  getDefaultLeft,
  getDefaultTop,
  getDraggableBounds,
  MINIMIZED_HEIGHT,
} from './draggable-helpers';

interface StyledContainerProps extends GridProps {
  component?: React.ElementType;
}

interface StyledBoxProps extends BoxProps {
  top?: number;
  left?: number;
}

interface DraggableResizableModalProps {
  open: boolean;
  children: ReactNode;
  title?: string;
  onClose?: () => void;
  defaultSize?: [number, number];
  minSize?: [number, number];
  maxSize?: [number, number];
  onResizeStop?: () => void;
  minimized?: boolean;
  onMinimize?: (minimized: boolean) => void;
  top?: number;
  left?: number;
  unmountOnExit?: boolean;
}

const StyledBox = styled(Box)<StyledBoxProps>(({ top, left }) => ({
  width: 0,
  position: 'absolute',
  ...(top && { top }),
  ...(left && { left }),
}));

const StyledContainer = styled(Grid)<StyledContainerProps>(({ theme }) => ({
  padding: 14,
  borderRadius: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  backdropFilter: 'blur(7px)',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: 0,
  },
}));

const StyledHeader = styled(Grid)<GridProps>(({ theme }) => ({
  cursor: 'move',
  marginBottom: 8,
  [theme.breakpoints.down('sm')]: {
    marginBottom: 0,
  },
}));

const StyledContent = styled(Grid)<GridProps>({
  overflow: 'auto',
  padding: '0 8px 8px',
  '&::-webkit-scrollbar': {
    width: '1.6em',
  },
  '&::-webkit-scrollbar-thumb:vertical': {
    border: '0.5em solid rgba(0, 0, 0, 0)',
    backgroundClip: 'padding-box',
    WebkitBorderRadius: '1em',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    WebkitBoxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.025)',
  },
  '&::-webkit-scrollbar-corner': {
    background: 'rgba(0,0,0,0)',
  },
});

const StyledHandle = styled('span')({
  position: 'absolute',
  right: 4,
  bottom: 4,
  width: 10,
  height: 10,
  padding: 4,
  margin: 4,
  borderRight: '2px solid rgba(0, 0, 0, 0.4)',
  borderBottom: '2px solid rgba(0, 0, 0, 0.4)',
  cursor: 'nwse-resize',
});

const DraggableResizableModal = ({
  open,
  defaultSize = DEFAULT_SIZE,
  minSize = DEFAULT_MIN_SIZE,
  maxSize,
  title = '',
  onClose,
  onResizeStop,
  children,
  minimized: minimizedProp = false,
  onMinimize,
  top = getDefaultTop(),
  left = getDefaultLeft(),
  unmountOnExit = false,
}: DraggableResizableModalProps) => {
  const { map } = useContext(MapContext);
  const draggableRef = useRef(null);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const [id, setId] = useState<string>('');
  const [size, setSize] = useState<[number, number]>(calculateSize(defaultSize as [number, number], maxSize));
  const [minimized, setMinimized] = useState<boolean>(minimizedProp as boolean);

  useEffect(() => {
    if (!map || !modalRef.current) return;

    const modalControl = new Control({
      element: modalRef.current as HTMLDivElement,
    });
    map.addControl(modalControl);

    setId(`draggable_${_.uniqueId()}`);

    return () => {
      map.removeControl(modalControl);
    };
  }, [map]);

  useEffect(() => {
    setSize(calculateSize(size, maxSize));
  }, [defaultSize]);

  useEffect(() => {
    if (minimizedProp !== undefined) {
      setMinimized(minimizedProp);
    }
  }, [minimizedProp]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleMinimize = () => {
    const newMinimized = !minimized;
    setMinimized(newMinimized);
    if (onMinimize) {
      onMinimize(newMinimized);
    }
  };

  const handleResizeStop = (event: React.SyntheticEvent, data: ResizeCallbackData) => {
    const { width, height } = data.size;
    setSize([width, height]);
    if (onResizeStop) {
      onResizeStop();
    }
  };

  const handleDragStop = () => {};

  return (
    <div ref={modalRef}>
      <Grow in={open} timeout={350} unmountOnExit={unmountOnExit}>
        <StyledBox top={top} left={left}>
          <Draggable nodeRef={draggableRef} handle={`#${id}`} bounds={getDraggableBounds(size, top, left)}>
            <Grid ref={draggableRef} className={id}>
              <ResizableBox
                width={size[0]}
                height={minimized ? MINIMIZED_HEIGHT : size[1]}
                minConstraints={minSize}
                maxConstraints={calculateMaxSize(maxSize)}
                onResizeStop={handleResizeStop}
                handle={<StyledHandle />}
                style={{ position: 'relative' }}
              >
                <StyledContainer container height='100%' direction='column' flexWrap='nowrap' component={Paper}>
                  <StyledHeader id={id} item container justifyContent='space-between'>
                    <Grid item fontWeight={600} fontSize={24}>
                      {title}
                    </Grid>
                    <Grid item>
                      <IconButton onClick={handleMinimize} onTouchEnd={handleMinimize}>
                        {minimized ? <CropSquare /> : <Minimize />}
                      </IconButton>
                      {onClose ? (
                        <IconButton onClick={handleClose} onTouchEnd={handleClose}>
                          <Close />
                        </IconButton>
                      ) : null}
                    </Grid>
                  </StyledHeader>
                  <StyledContent item container height='100%' maxHeight='100%'>
                    {children}
                  </StyledContent>
                </StyledContainer>
              </ResizableBox>
            </Grid>
          </Draggable>
        </StyledBox>
      </Grow>
    </div>
  );
};

export default DraggableResizableModal;
