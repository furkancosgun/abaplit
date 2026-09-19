import React from 'react';
import ErrorBoundary from './common/ErrorBoundary';
import ErrorDisplay from './common/ErrorDisplay';
import { resolveBinding } from '../core/binding';

import Container from './layout/Container';
import Columns from './layout/Columns';
import Expander from './layout/Expander';
import Tabs from './layout/Tabs';
import Dialog from './layout/Dialog';
import StatusContainer from './layout/StatusContainer';
import Popover from './layout/Popover';

import Button from './inputs/Button';
import LinkButton from './inputs/LinkButton';
import TextInput from './inputs/TextInput';
import NumberInput from './inputs/NumberInput';
import TextArea from './inputs/TextArea';
import Checkbox from './inputs/Checkbox';
import Toggle from './inputs/Toggle';
import Selectbox from './inputs/Selectbox';
import MultiSelect from './inputs/MultiSelect';
import Radio from './inputs/Radio';
import Pills from './inputs/Pills';
import SegmentedControl from './inputs/SegmentedControl';
import Feedback from './inputs/Feedback';
import Slider from './inputs/Slider';
import ColorPicker from './inputs/ColorPicker';
import DateInput from './inputs/DateInput';
import TimeInput from './inputs/TimeInput';
import FileUploader from './inputs/FileUploader';

import TableWidget from './data/TableWidget';
import DataframeWidget from './data/DataframeWidget';
import MetricWidget from './data/MetricWidget';
import JsonWidget from './data/JsonWidget';
import CodeWidget from './data/CodeWidget';
import BadgeWidget from './data/BadgeWidget';
import StreamlitChart from './charts/StreamlitChart';

import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';

import AlertWidget from './feedback/AlertWidget';
import ProgressWidget from './feedback/ProgressWidget';
import SpinnerWidget from './feedback/SpinnerWidget';
import ToastWidget from './feedback/ToastWidget';
import ConfettiWidget from './feedback/ConfettiWidget';

import { ImageWidget, AudioWidget, VideoWidget, DownloadButton } from './media/MediaWidgets';

export { resolveBinding };

export default function WidgetRenderer({ node, state, onValueChange, onEvent, isRunning }) {
  if (!node) return null;

  const renderChildren = (children) => {
    if (!children || !Array.isArray(children)) return null;
    return children.map((child, idx) => (
      <WidgetRenderer
        key={idx}
        node={child}
        state={state}
        onValueChange={onValueChange}
        onEvent={onEvent}
        isRunning={isRunning}
      />
    ));
  };

  const renderContent = () => {
    const textContent = node.text || node.body || node.val || '';

    switch (node.type) {
      case 'title':
        return <h1 className="st-title">{textContent}</h1>;

      case 'header':
        return <h2 className="st-header-title">{textContent}</h2>;

      case 'subheader':
        return <h3 className="st-subheader">{textContent}</h3>;

      case 'write':
      case 'text':
      case 'markdown':
        return <p className="st-text">{textContent}</p>;

      case 'caption':
        return <p className="st-caption">{textContent}</p>;

      case 'divider':
        return <hr className="st-divider" />;

      case 'code':
        return <CodeWidget node={node} />;

      case 'badge':
        return <BadgeWidget node={node} />;

      case 'container':
        return <Container node={node} renderChildren={renderChildren} />;

      case 'columns':
        return <Columns node={node} renderChildren={renderChildren} />;

      case 'expander':
        return <Expander node={node} renderChildren={renderChildren} />;

      case 'tabs':
        return <Tabs node={node} renderChildren={renderChildren} />;

      case 'dialog':
        return <Dialog node={node} renderChildren={renderChildren} />;

      case 'status':
        return <StatusContainer node={node} renderChildren={renderChildren} />;

      case 'popover':
        return <Popover node={node} renderChildren={renderChildren} />;

      case 'button':
        return <Button node={node} onEvent={onEvent} isRunning={isRunning} />;

      case 'link_button':
        return <LinkButton node={node} />;

      case 'download_button':
        return <DownloadButton node={node} state={state} />;

      case 'text_input':
        return (
          <TextInput
            node={node}
            state={state}
            onValueChange={onValueChange}
            onEvent={onEvent}
          />
        );

      case 'number_input':
        return (
          <NumberInput
            node={node}
            state={state}
            onValueChange={onValueChange}
            onEvent={onEvent}
          />
        );

      case 'text_area':
        return (
          <TextArea
            node={node}
            state={state}
            onValueChange={onValueChange}
          />
        );

      case 'checkbox':
        return (
          <Checkbox
            node={node}
            state={state}
            onValueChange={onValueChange}
            onEvent={onEvent}
          />
        );

      case 'toggle':
        return (
          <Toggle
            node={node}
            state={state}
            onValueChange={onValueChange}
            onEvent={onEvent}
          />
        );

      case 'selectbox':
        return (
          <Selectbox
            node={node}
            state={state}
            onValueChange={onValueChange}
            onEvent={onEvent}
          />
        );

      case 'multiselect':
        return (
          <MultiSelect
            node={node}
            state={state}
            onValueChange={onValueChange}
            onEvent={onEvent}
          />
        );

      case 'radio':
        return (
          <Radio
            node={node}
            state={state}
            onValueChange={onValueChange}
            onEvent={onEvent}
          />
        );

      case 'pills':
        return (
          <Pills
            node={node}
            state={state}
            onValueChange={onValueChange}
            onEvent={onEvent}
          />
        );

      case 'segmented_control':
        return (
          <SegmentedControl
            node={node}
            state={state}
            onValueChange={onValueChange}
            onEvent={onEvent}
          />
        );

      case 'feedback':
        return (
          <Feedback
            node={node}
            state={state}
            onValueChange={onValueChange}
            onEvent={onEvent}
          />
        );

      case 'slider':
        return (
          <Slider
            node={node}
            state={state}
            onValueChange={onValueChange}
            onEvent={onEvent}
          />
        );

      case 'color_picker':
        return (
          <ColorPicker
            node={node}
            state={state}
            onValueChange={onValueChange}
            onEvent={onEvent}
          />
        );

      case 'date_input':
        return (
          <DateInput
            node={node}
            state={state}
            onValueChange={onValueChange}
            onEvent={onEvent}
          />
        );

      case 'time_input':
        return (
          <TimeInput
            node={node}
            state={state}
            onValueChange={onValueChange}
            onEvent={onEvent}
          />
        );

      case 'file_uploader':
        return <FileUploader node={node} onEvent={onEvent} />;

      case 'table':
        return <TableWidget node={node} state={state} />;

      case 'dataframe':
        return <DataframeWidget node={node} state={state} />;

      case 'metric':
        return <MetricWidget node={node} state={state} />;

      case 'json':
        return <JsonWidget node={node} state={state} />;

      case 'line_chart':
      case 'bar_chart':
      case 'area_chart':
      case 'scatter_chart': {
        const bound = resolveBinding(node.data, state);
        if (bound.error) {
          return <ErrorDisplay error={bound.error} title={`Binding Error (${node.type})`} />;
        }
        return (
          <StreamlitChart
            type={node.type}
            data={bound.isBound ? bound.value : node.data}
            height={node.height}
            bindingPath={bound.key}
          />
        );
      }

      case 'chat_message':
        return <ChatMessage node={node} renderChildren={renderChildren} />;

      case 'chat_input':
        return <ChatInput node={node} onEvent={onEvent} isRunning={isRunning} />;

      case 'image':
        return <ImageWidget node={node} />;

      case 'audio':
        return <AudioWidget node={node} />;

      case 'video':
        return <VideoWidget node={node} />;

      case 'success':
      case 'info':
      case 'warning':
      case 'error':
        return <AlertWidget type={node.type} text={textContent} />;

      case 'progress':
        return <ProgressWidget node={node} />;

      case 'spinner':
        return <SpinnerWidget node={node} />;

      case 'toast':
        return <ToastWidget node={node} />;

      case 'balloons':
      case 'snow':
        return <ConfettiWidget type={node.type} />;

      default:
        return null;
    }
  };

  return <ErrorBoundary>{renderContent()}</ErrorBoundary>;
}
