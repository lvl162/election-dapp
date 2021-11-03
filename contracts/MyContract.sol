// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

contract Election {
    address admin;
    uint256 candidateCount;
    uint256 voterCount;
    event votingCompleted();
    event registeredAsVoter(address _voter, uint256 _registeredAt);
    event stageChange(Stage _stage, uint256 _changedAt );
    event votedToCandidate(address _voter, uint[] points, uint256 _votedAt);
    event candidateAdded(address _admin, string _name,  uint256 _addedAt);
    uint256 startTime;
    enum Stage {
        Init,
        Reg,
        Vote,
        Done
    }
    Stage public stage = Stage.Init;
    
    constructor() public{
        // Initilizing default values
        admin = msg.sender;
        candidateCount = 0;
        voterCount = 0;
        startTime = block.timestamp;
        emit stageChange(Stage.Init, block.timestamp );

    }

    function getAdmin() public view returns (address) {
        // Returns account address used to deploy contract (i.e. admin)
        return admin;
    }

    modifier onlyAdmin() {
        // Modifier for only admin access
        require(msg.sender == admin);
        _;
    }
    modifier onlyNotAdded() {
        // Modifier for only admin access
        require(msg.sender == admin);
        _;
    }
    // Modeling a candidate
    struct Candidate {
        uint256 candidateId;
        string header;
        string slogan;
        uint256 totalPoint;
    }
    mapping(uint256 => Candidate) public candidateDetails;

    // Adding new candidates
    function addCandidate(string memory _header, string memory _slogan)
        public
        onlyAdmin
        validStage(Stage.Reg)
    {
        require(candidateCount <= 2);
        Candidate memory newCandidate = Candidate({
            candidateId: candidateCount,
            header: _header,
            slogan: _slogan,
            totalPoint: 0
        });
        candidateDetails[candidateCount] = newCandidate;
        candidateCount += 1;
        emit candidateAdded(msg.sender,  _header, block.timestamp);

    }

    // Modeling a Election Details
    struct ElectionDetails {
        string adminName;
        string adminEmail;
        string adminTitle;
        string electionTitle;
        string organizationTitle;
        bool isRegistered;
    }
    ElectionDetails electionDetails;

    function setElectionDetails(
        string memory _adminName,
        string memory _adminEmail,
        string memory _adminTitle,
        string memory _electionTitle,
        string memory _organizationTitle
    )
        public
        // Only admin can add
        onlyAdmin
        validStage(Stage.Init)
    {
        require(!electionDetails.isRegistered);
        electionDetails = ElectionDetails(
            _adminName,
            _adminEmail,
            _adminTitle,
            _electionTitle,
            _organizationTitle,
            true
        );
        stage = Stage.Reg;
        emit stageChange(Stage.Reg, block.timestamp );

    }

    // Get Elections details
    function getAdminName() public view returns (string memory) {
        return electionDetails.adminName;
    }

    function getAdminEmail() public view returns (string memory) {
        return electionDetails.adminEmail;
    }

    function getAdminTitle() public view returns (string memory) {
        return electionDetails.adminTitle;
    }

    function getElectionTitle() public view returns (string memory) {
        return electionDetails.electionTitle;
    }

    function getOrganizationTitle() public view returns (string memory) {
        return electionDetails.organizationTitle;
    }

    // Get candidates count
    function getTotalCandidate() public view returns (uint256) {
        // Returns total number of candidates
        return candidateCount;
    }

    // Get voters count
    function getTotalVoter() public view returns (uint256) {
        // Returns total number of voters
        return voterCount;
    }

    // Modeling a voter
    struct Voter {
        address voterAddress;
        bool hasVoted;
        bool isRegistered;
        uint256[] pointForEachCandidate;
    }
    address[] public voters; // Array of address to store address of voters
    mapping(address => Voter) public voterDetails;

    // Request to be added as voter
    function registerAsVoter()
        public
        validStage(Stage.Reg)
    {
        require(msg.sender != admin && !voterDetails[msg.sender].isRegistered);

        voterDetails[msg.sender].voterAddress = msg.sender;
        voterDetails[msg.sender].isRegistered = true;
        voterDetails[msg.sender].hasVoted = false;

        voters.push(msg.sender);

        voterCount += 1;
        emit registeredAsVoter(msg.sender, block.timestamp);
    }


    // Vote
    function vote(uint[] memory points) public validStage(Stage.Vote) {
        require(voterDetails[msg.sender].hasVoted == false);
        require(voterDetails[msg.sender].isRegistered == true);
        require(points.length == 3);
        // voterDetails[msg.sender].votedToCandidate = candidateId;
        for(uint i = 0; i<points.length; i++) {
            voterDetails[msg.sender].pointForEachCandidate.push(points[i]);
            candidateDetails[i].totalPoint += points[i];
        }
        voterDetails[msg.sender].hasVoted = true;
        emit votedToCandidate(msg.sender, points, block.timestamp);
    }

    // Get election start and end values
    function getStart() public view returns (bool) {
        return stage >= Stage.Reg;
    }

    function getEnd() public view returns (bool) {
        return stage == Stage.Done;
    }

    function getVoting() public view returns (bool) {
        return stage >= Stage.Vote;
    }

    function endElection() public onlyAdmin {
        stage = Stage.Done;
        emit stageChange(Stage.Done, block.timestamp );

    }

    function startVotingElection() public onlyAdmin {
        stage = Stage.Vote;
        emit stageChange(Stage.Vote, block.timestamp );

    }

    function winningProposal()
        public
        view
        validStage(Stage.Done)
        returns (uint8 _winningProposal)
    {
        //if(stage != Stage.Done) {return;}
        uint256 winningTotalPoint = 0;
        for (uint8 prop = 0; prop < candidateCount; prop++)
            if (candidateDetails[prop].totalPoint > winningTotalPoint) {
                winningTotalPoint = candidateDetails[prop].totalPoint;
                _winningProposal = prop;
            }
        assert(winningTotalPoint > 0);
    }

    modifier validStage(Stage reqStage) {
        require(stage == reqStage);
        _;
    }
    
}
