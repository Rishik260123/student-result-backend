CREATE DATABASE IF NOT EXISTS StudentResultSystem;
USE StudentResultSystem;

CREATE TABLE Student(
    StudentID INT PRIMARY KEY AUTO_INCREMENT,
    StudentName VARCHAR(100) NOT NULL,
    Phone_Number VARCHAR(15),
    Email VARCHAR(100)
);

CREATE TABLE Subject(
    SubjectCode VARCHAR(10) PRIMARY KEY,
    SubjectName VARCHAR(100) NOT NULL
);

CREATE TABLE Admin(
    AdminID INT PRIMARY KEY AUTO_INCREMENT,
    AdminName VARCHAR(100) NOT NULL,
    AdminEmail VARCHAR(100)
);

CREATE TABLE Result(
    ResultID INT PRIMARY KEY AUTO_INCREMENT,
    MarksObtained INT,
    Grade CHAR(2),
    StudentID INT,
    SubjectCode VARCHAR(10),
    AdminID INT,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID) ON DELETE CASCADE,
    FOREIGN KEY (SubjectCode) REFERENCES Subject(SubjectCode) ON DELETE CASCADE,
    FOREIGN KEY (AdminID) REFERENCES Admin(AdminID) ON DELETE CASCADE
);

CREATE TABLE Notification(
    AlertID INT PRIMARY KEY AUTO_INCREMENT,
    AlertStatus VARCHAR(20) DEFAULT "Pending",
    Channel VARCHAR(20),
    AlertTimeStamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ResultID INT,
    FOREIGN KEY (ResultID) REFERENCES Result(ResultID) ON DELETE CASCADE
);

DELIMITER //

CREATE TRIGGER After_Result_Insert
AFTER INSERT ON Result
FOR EACH ROW
BEGIN
    INSERT INTO Notification(AlertStatus, Channel, ResultID)
    VALUES("Pending", "Email", NEW.ResultID);
END //

DELIMITER ;