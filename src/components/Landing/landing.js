import React, { Component } from 'react'

export class Landing extends Component {
    render() {
        return (
            <div className="">
                <div class="jumbotron">
                    <div class="container">
                        <h1 class="display-4">Hello!</h1>
                        <p class="lead">This is a simple notepad app that allows you to create a database of elements to mention within throughout your quest planning.</p>

                        <p>Organise your quests, find and share information faster.</p>
                        <p class="lead">
                            <a class="btn btn-primary btn-lg" href="#" role="button">Sign Up For Free</a>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Landing
