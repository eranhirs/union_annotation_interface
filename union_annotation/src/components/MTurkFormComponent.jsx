import * as React from 'react';

class MTurkFormComponent extends React.Component {
    render() {
      return <span>
        <form name='mturk_form' method='post' id='mturk_form' action='https://www.mturk.com/mturk/externalSubmit'>
          <input type='hidden' value='' name='assignmentId' id='assignmentId'/>
          {this.props.children}
        </form>
        <script language='Javascript'>turkSetAssignmentID();</script>
      </span>

    }
}

export default MTurkFormComponent;
