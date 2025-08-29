import React, { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import ConfigModal from './components/ConfigModal';
import { Widget, Connection, Theme } from './types';

const App: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [theme] = useState<Theme>('light');

  const updateWidget = (id: string, changes: Partial<Widget>) =>
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, ...changes } : w)));

  const onAddWidget = (type: string, position: { x: number; y: number }) => {
    const id = `widget-${Date.now()}`;
    setWidgets((prev) => [...prev, { id, type, position, data: {}, label: '' }]);
  };

  const onOpenConfig = (widget: Widget) => setSelectedWidget(widget);
  const onDeleteWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    setConnections((prev) => prev.filter((c) => c.fromId !== id && c.toId !== id));
  };
  const onUpdateWidget = (id: string, changes: Partial<Widget>) => updateWidget(id, changes);

  const addConnection = useCallback(
    (fromId: string, toId: string) => {
      const newConnection: Connection = { id: `conn-${Date.now()}`, fromId, toId };
      setConnections((prev) => [...prev, newConnection]);

      const fromWidget = widgets.find((w) => w.id === fromId);
      const toWidget = widgets.find((w) => w.id === toId);

      if (!fromWidget || !toWidget) return;

      // File Upload/Blank Remover -> Mean Average
      if (
        (fromWidget.type === 'file-upload' || fromWidget.type === 'blank-remover') &&
        toWidget.type === 'mean-average'
      ) {
        const tableData = fromWidget.data?.tableData || fromWidget.data?.parsedData || [];
        setWidgets((prev) =>
          prev.map((widget) =>
            widget.id === toId
              ? {
                  ...widget,
                  data: {
                    ...widget.data,
                    tableData,
                    meanType: 'row', // default selection
                    meanResult: [],  // will be calculated in the widget
                  },
                }
              : widget
          )
        );
      }

      // Mean Average -> Data Table
      if (fromWidget.type === 'mean-average' && toWidget.type === 'data-table') {
        setWidgets((prev) =>
          prev.map((widget) =>
            widget.id === toId
              ? {
                  ...widget,
                  data: {
                    ...widget.data,
                    tableData: fromWidget.data?.meanResult || [],
                  },
                }
              : widget
          )
        );
      }

      // File Upload -> Blank Remover: fill blanks with "NIL"
      if (fromWidget.type === 'file-upload' && toWidget.type === 'blank-remover') {
        const tableData = fromWidget.data?.parsedData || [];
        // Replace all blank/empty/null/undefined cells with "NIL"
        const processed = tableData.map((row: any) => {
          const newRow: any = {};
          Object.entries(row).forEach(([key, val]) => {
            newRow[key] =
              val === null ||
              val === undefined ||
              (typeof val === 'string' && val.trim() === '')
                ? 'NIL'
                : val;
          });
          return newRow;
        });
        setWidgets((prev) =>
          prev.map((widget) =>
            widget.id === toId
              ? {
                  ...widget,
                  data: { ...widget.data, tableData: processed },
                }
              : widget
          )
        );
      }

      // Blank Remover -> Data Table
      if (fromWidget.type === 'blank-remover' && toWidget.type === 'data-table') {
        setWidgets((prev) =>
          prev.map((widget) =>
            widget.id === toId
              ? {
                  ...widget,
                  data: {
                    ...widget.data,
                    tableData: fromWidget.data?.tableData || [],
                  },
                }
              : widget
          )
        );
      }

      // File Upload -> Data Table (unchanged)
      if (fromWidget.type === 'file-upload' && toWidget.type === 'data-table') {
        setWidgets((prev) =>
          prev.map((widget) =>
            widget.id === toId
              ? {
                  ...widget,
                  data: {
                    ...widget.data,
                    tableData: fromWidget.data?.parsedData || [],
                  },
                }
              : widget
          )
        );
      }

      // File Upload -> Line Chart
      if (fromWidget.type === 'file-upload' && toWidget.type === 'line-chart') {
        setWidgets((prev) =>
          prev.map((widget) =>
            widget.id === toId
              ? {
                  ...widget,
                  data: {
                    ...widget.data,
                    tableData: fromWidget.data?.parsedData || [],
                  },
                }
              : widget
          )
        );
      }

      // File Upload -> Scatter Plot
      if (fromWidget.type === 'file-upload' && toWidget.type === 'scatter-plot') {
        setWidgets((prev) =>
          prev.map((widget) =>
            widget.id === toId
              ? {
                  ...widget,
                  data: {
                    ...widget.data,
                    tableData: fromWidget.data?.parsedData || [],
                  },
                }
              : widget
          )
        );
      }

      // File Upload -> Box Plot
      if (fromWidget.type === 'file-upload' && toWidget.type === 'box-plot') {
        setWidgets((prev) =>
          prev.map((widget) =>
            widget.id === toId
              ? {
                  ...widget,
                  data: {
                    ...widget.data,
                    tableData: fromWidget.data?.parsedData || [],
                  },
                }
              : widget
          )
        );
      }

      // File Upload -> Bar Chart
      if (fromWidget.type === 'file-upload' && toWidget.type === 'bar-chart') {
        setWidgets((prev) =>
          prev.map((widget) =>
            widget.id === toId
              ? {
                  ...widget,
                  data: {
                    ...widget.data,
                    tableData: fromWidget.data?.parsedData || [],
                  },
                }
              : widget
          )
        );
      }
    },
    [widgets]
  );

  return (
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <ErrorBoundary>
          <div className="flex flex-col h-screen">
            <Header onToggleTheme={() => {}} theme={theme} />
            <div className="flex flex-1">
              <Sidebar onAddWidget={onAddWidget} />
              <Canvas
                widgets={widgets}
                connections={connections}
                onUpdateWidget={onUpdateWidget}
                onDeleteWidget={onDeleteWidget}
                onOpenConfig={onOpenConfig}
                onAddConnection={addConnection}
                onAddWidget={onAddWidget}
              />
            </div>
            {selectedWidget && (
              <ConfigModal
                isOpen={!!selectedWidget}
                widget={selectedWidget}
                onClose={() => setSelectedWidget(null)}
                onUpdate={onUpdateWidget}
                theme={theme}
              />
            )}
          </div>
        </ErrorBoundary>
      </DndProvider>
    </ThemeProvider>
  );
};

export default App;