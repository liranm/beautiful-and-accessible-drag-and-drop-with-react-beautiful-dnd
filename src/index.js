import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
import initialData from './initial-data';
import Column from './column';

const Container = styled.div`
    display: flex;
`;

class App extends React.Component {
    state = initialData;

    onDragStart = start => {
        const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);

        this.setState({ homeIndex });
    }
    
    onDragEnd = result => {
        this.setState({ homeIndex: null });

        const { destination, source, draggableId } = result;

        if(!destination) {
            return;
        }

        if(destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const start = this.state.columns[source.droppableId];
        const finish = this.state.columns[destination.droppableId];

        if(start === finish) {
            const newTaskIds = Array.from(start.taskIds);
    
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);
    
            const newColumn = {
                ...start,
                taskIds: newTaskIds
            };
    
            this.setState({
                columns: {
                    ...this.state.columns,
                    [newColumn.id]: newColumn
                }
            });

            return;
        }

        // Moving from one list to another
        const startTaskIds = Array.from(start.taskIds);   
        
        startTaskIds.splice(source.index, 1);

        const newStart = {
            ...start,
            taskIds: startTaskIds
        };

        const finishTaskIds = Array.from(finish.taskIds);

        finishTaskIds.splice(destination.index, 0, draggableId);

        const newFinish = {
            ...finish,
            taskIds: finishTaskIds
        };

        this.setState({
            columns: {
                ...this.state.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            }
        });
    }

    render() {
        return (
            <DragDropContext
                onDragEnd={this.onDragEnd}
                onDragStart={this.onDragStart}
            >
                <Container>
                    {this.state.columnOrder.map((columnId, index) => {
                        const column = this.state.columns[columnId];
                        const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);
                        const isDropDisabled = index < this.state.homeIndex;
            
                        return (
                            <Column
                                key={column.id}
                                column={column}
                                tasks={tasks}
                                isDropDisabled={isDropDisabled}
                            />
                        );
                    })}
                </Container>
            </DragDropContext>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
