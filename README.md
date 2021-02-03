TODO -app frontend
School project made during the end of 2020 - start of 2021

Lauri Pääjärvi
Elias Puukari

Easiest way to demo this project is to test it out in
https://tamk-4a00ez62-3001-group02.herokuapp.com/

If you want to install it locally instead, you need to clone both this
todo-frontend and another repo todo-backend,
sql database needed as well, check creation scripts in todo-backend).

It's also possible to install this all as a full-stack app if you make a build
of the both frontend and backend in a remote server with a remote sql database.

Check the commands in npx-create-react-app:s readme file in todo-react/README.md
if you don't know them already. (I should probably update this later for proper
info, but there's other things I need to prioritize right now.)

About Frontend code:

Vast majority of front end coding was done by me, but Elias Puukari adjusted
and added some of the CSS code. He also contributed a great deal in the design
part of the frontend before we started working on the app, and we discussed
about many possibilites or routes we could take with UI later throughout the
project.

Uses material-table-component which automatised a lot of things we designed to
do in this app very easily, but also caused a lot of unexpected problems, and
uploading it to Heroku caused even more problems for the
component. in the end we managed to correct them mostly. There's more info about
these issues in the comments of the code files.

The syntax of props differs a bit from the standard but it works the way
it should.

Especially the code regarding the use of AxiosConnector could use lots of
refactoring but I didn't want to risk causing bugs to it after implementing the
functionality to show success/failure info about the last action performed in
the last days before the final deadline.

I'm also not proud about HandleFetchChange -function. It was originally
implemented to fix the problems about Material Table where it wouldn't include
all the new data it was supposed to fetch from the remote database, and in the
end I also made it help showing the info about last action. All in all it
should work correctly and I needed some solutions to each problem at hand, but
I'm aware it's very bad codewise.

Unfixed known bugs in the frontend:

- Doesn't affect a locally installed version, but calendar component might save
  a wrong date (one day off), if it's typed manually, instead of choosing it
  from the opening view. Could be fixed with code to take different timezones
  into account.

Not really bugs but could be improved with some work:

- The slider functionality.

- The view with date in material component table could show for example -NOT
  SET- instead of 0000-00-00 and maybe there could be a way to set the date
  there as well without needing to change it via edit-button.
