import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm />);
});

test('renders the contact form header', ()=> {
    render(<ContactForm />)
    const contactHeader = screen.getByText("Contact Form");
    expect(contactHeader).toBeInTheDocument();
    expect(contactHeader).toBeTruthy();
    expect(contactHeader).toHaveTextContent("Contact Form");
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const firstnameInput = screen.getByLabelText("First Name*");
    const shortFirstname = "Asd";
    userEvent.type(firstnameInput, shortFirstname);
    await waitFor(() => {
        const firstnameError = screen.queryByText("Error: firstName must have at least 5 characters.");
        expect(firstnameError).toBeInTheDocument();
    })

});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);
    const firstnameError = screen.queryByText("Error: firstName must have at least 5 characters.");
    expect(firstnameError).toBeInTheDocument();
    const lastnameError = screen.queryByText("Error: lastName is a required field.");
    expect(lastnameError).toBeInTheDocument();
    const emailError = screen.queryByText("Error: email must be a valid email address.");
    expect(emailError).toBeInTheDocument();
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);
    const firstnameInput = screen.getByLabelText("First Name*");
    userEvent.type(firstnameInput, "Butters");
    const lastnameInput = screen.getByLabelText("Last Name*");
    userEvent.type(lastnameInput, "Stotch");
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);
    const emailError = screen.queryByText("Error: email must be a valid email address.");
    expect(emailError).toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);
    const emailInput = screen.getByLabelText("Email*");
    userEvent.type(emailInput, "butters");
    const emailError = screen.queryByText("Error: email must be a valid email address.");
    expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);
    const firstnameInput = screen.getByLabelText("First Name*");
    userEvent.type(firstnameInput, "Butters");
    const emailInput = screen.getByLabelText("Email*");
    userEvent.type(emailInput, "butters@stotch.com");
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);
    const lastnameError = screen.queryByText("Error: lastName is a required field.");
    expect(lastnameError).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);
    const firstnameInput = screen.getByLabelText("First Name*");
    userEvent.type(firstnameInput, "Butters");
    const lastnameInput = screen.getByLabelText("Last Name*");
    userEvent.type(lastnameInput, "Stotch");
    const emailInput = screen.getByLabelText("Email*");
    userEvent.type(emailInput, "butters@stotch.com");
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);
    await waitFor(() => {
        const firstnameFeedback = screen.queryByText("Butters");
        expect(firstnameFeedback).toBeInTheDocument();
        const lastnameFeedback = screen.queryByText("Stotch");
        expect(lastnameFeedback).toBeInTheDocument();
        const emailFeedback = screen.queryByText("butters@stotch.com");
        expect(emailFeedback).toBeInTheDocument();
        const message = screen.queryByText("Message:");
        expect(message).not.toBeInTheDocument();
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);
    const firstnameInput = screen.getByLabelText("First Name*");
    userEvent.type(firstnameInput, "Butters");
    const lastnameInput = screen.getByLabelText("Last Name*");
    userEvent.type(lastnameInput, "Stotch");
    const emailInput = screen.getByLabelText("Email*");
    userEvent.type(emailInput, "butters@stotch.com");
    const messageInput = screen.getByLabelText("Message");
    userEvent.type(messageInput, "loo loo loo I've got some apples")
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);
    await waitFor(() => {
        const firstnameFeedback = screen.queryByText("Butters");
        expect(firstnameFeedback).toBeInTheDocument();
        const lastnameFeedback = screen.queryByText("Stotch");
        expect(lastnameFeedback).toBeInTheDocument();
        const emailFeedback = screen.queryByText("butters@stotch.com");
        expect(emailFeedback).toBeInTheDocument();
        const messageFeedback = screen.queryByTestId("messageDisplay");
        expect(messageFeedback).toBeInTheDocument();
    })
});