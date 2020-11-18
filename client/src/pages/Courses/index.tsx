import React, { useState, useEffect, useContext } from "react";
import { Collapse, Card, CardContent, CardHeader, TextField, Typography, Button } from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from "components/Navbar";


const useStyles = makeStyles({
    root: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#eceef8'
    },
    button: {
        margin: '20px'
    },
    icon: {
        margin: '5px',
        marginLeft: '8px',
        marginRight: '2px'
    },
    search: {
        marginTop: '20px'
    },
    addCard: {
        minWidth: 300,
        maxWidth: 300,
        margin: '20px',
        marginTop: 0,
        display: 'inline-block'
    },
    card: {
      minWidth: 300,
      maxWidth: 300,
      margin: '20px',
      display: 'inline-block'
    },
    title: {
        marginTop: '20px'
    }
});

const FakeCard: React.FC = () => {
    const classes = useStyles();

    return (
    <Card className={classes.card}>
        <CardHeader title="CSCI 49378" />
        <CardContent>
            <Typography variant="h5">
                Professor: Bonan Lau
            </Typography>
            <Typography variant="h5">
                Time: Wed 5:35 PM - 8:35 PM
            </Typography>
        </CardContent>
    </Card>
    );
}

const Courses: React.FunctionComponent = () => {
    const classes = useStyles();
    const [checked, setChecked] = React.useState(false);

    const handleClick = () => {
        setChecked((prev) => !prev);
      };


    return (
        <div className={classes.root}>
            <Navbar />
            <Typography variant="h2" className={classes.title}>
                <b>My Courses</b>
            </Typography>
            <Button variant="contained" color="primary" className={classes.button} onClick={handleClick}> Add Course <AddCircleIcon className={classes.icon}/></Button>
            <Collapse in={checked}>
                <Card className={classes.addCard}> 
                    <TextField id="outlined-basic" label="Enter Course Code" variant="outlined" className={classes.search}/>
                    <div>
                        <Button variant="contained" color="primary" className={classes.button} onClick={handleClick}> Cancel </Button>
                        <Button variant="contained" color="primary" className={classes.button}> Join </Button>
                    </div>
                </Card>   
            </Collapse>

            <div className={classes.root}>
                <FakeCard />
                <FakeCard />
                <FakeCard />
                <FakeCard />
                <FakeCard />
                <FakeCard />
                <FakeCard />
            </div>
        </div>
    );
};

export default Courses;
