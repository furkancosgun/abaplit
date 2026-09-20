import React from 'react';
import ErrorBoundary from './common/ErrorBoundary';
import { resolveBinding, getBoundValue } from '../core/binding';
import { resolveDataset, resolveNodeText } from '../core/utils';

import Container from './layout/Container';
import Columns from './layout/Columns';
import Expander from './layout/Expander';
import Tabs from './layout/Tabs';
import Dialog from './layout/Dialog';
import StatusContainer from './layout/StatusContainer';
import Popover from './layout/Popover';
import Form from './layout/Form';
import EmptyWidget from './layout/EmptyWidget';

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
import DateTimeInput from './inputs/DateTimeInput';
import SelectSlider from './inputs/SelectSlider';
import FormSubmitButton from './inputs/FormSubmitButton';
import PageLink from './inputs/PageLink';
import FileUploader from './inputs/FileUploader';

import TableWidget from './data/TableWidget';
import DataframeWidget from './data/DataframeWidget';
import MetricWidget from './data/MetricWidget';
import JsonWidget from './data/JsonWidget';
import CodeWidget from './data/CodeWidget';
import BadgeWidget from './data/BadgeWidget';
import HtmlWidget from './data/HtmlWidget';
import StreamlitChart from './charts/StreamlitChart';

import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';

import AlertWidget from './feedback/AlertWidget';
import ProgressWidget from './feedback/ProgressWidget';
import SpinnerWidget from './feedback/SpinnerWidget';
import ToastWidget from './feedback/ToastWidget';
import ConfettiWidget from './feedback/ConfettiWidget';
import ExceptionWidget from './feedback/ExceptionWidget';

import { ImageWidget, AudioWidget, VideoWidget, DownloadButton } from './media/MediaWidgets';

export { resolveBinding };

const WIDGET_COMPONENTS = {
  container: Container,
  columns: Columns,
  expander: Expander,
  tabs: Tabs,
  dialog: Dialog,
  status: StatusContainer,
  popover: Popover,
  form: Form,
  empty: EmptyWidget,
  chat_message: ChatMessage,

  button: Button,
  link_button: LinkButton,
  download_button: DownloadButton,
  form_submit_button: FormSubmitButton,
  page_link: PageLink,
  text_input: TextInput,
  number_input: NumberInput,
  text_area: TextArea,
  checkbox: Checkbox,
  toggle: Toggle,
  selectbox: Selectbox,
  multiselect: MultiSelect,
  radio: Radio,
  pills: Pills,
  segmented_control: SegmentedControl,
  feedback: Feedback,
  slider: Slider,
  select_slider: SelectSlider,
  color_picker: ColorPicker,
  date_input: DateInput,
  time_input: TimeInput,
  datetime_input: DateTimeInput,
  file_uploader: FileUploader,
  chat_input: ChatInput,

  code: CodeWidget,
  badge: BadgeWidget,
  table: TableWidget,
  dataframe: DataframeWidget,
  metric: MetricWidget,
  json: JsonWidget,
  html: HtmlWidget,

  image: ImageWidget,
  audio: AudioWidget,
  video: VideoWidget,

  progress: ProgressWidget,
  spinner: SpinnerWidget,
  toast: ToastWidget,
  exception: ExceptionWidget,
};

const CHART_TYPES = new Set(['line_chart', 'bar_chart', 'area_chart', 'scatter_chart']);
const ALERT_TYPES = new Set(['success', 'info', 'warning', 'error']);

export default function WidgetRenderer({ node, state, onValueChange, onEvent, isRunning }) {
  if (!node) return null;

  const renderChildren = (children) => {
    if (!Array.isArray(children)) return null;
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
    const textContent = resolveNodeText(node, state);

    if (node.type === 'title') return <h1 className="st-title">{textContent}</h1>;
    if (node.type === 'header') return <h2 className="st-header-title">{textContent}</h2>;
    if (node.type === 'subheader') return <h3 className="st-subheader">{textContent}</h3>;
    if (node.type === 'write' || node.type === 'text' || node.type === 'markdown') {
      return <p className="st-text">{textContent}</p>;
    }
    if (node.type === 'caption') return <p className="st-caption">{textContent}</p>;
    if (node.type === 'divider') return <hr className="st-divider" />;

    if (ALERT_TYPES.has(node.type)) {
      return <AlertWidget type={node.type} text={textContent} state={state} />;
    }

    if (node.type === 'balloons' || node.type === 'snow') {
      return <ConfettiWidget key={Date.now()} type={node.type} />;
    }

    if (CHART_TYPES.has(node.type)) {
      const { data: chartData, bindingPath, isErrorFallback } = resolveDataset(node.data, state);
      if (isErrorFallback) {
        return <p className="st-text">{String(chartData)}</p>;
      }
      return (
        <StreamlitChart
          type={node.type}
          data={chartData}
          height={getBoundValue(node.height, state)}
          bindingPath={bindingPath}
        />
      );
    }

    const Component = WIDGET_COMPONENTS[node.type];
    if (Component) {
      return (
        <Component
          node={node}
          state={state}
          onValueChange={onValueChange}
          onEvent={onEvent}
          isRunning={isRunning}
          renderChildren={renderChildren}
        />
      );
    }

    return null;
  };

  return <ErrorBoundary>{renderContent()}</ErrorBoundary>;
}
